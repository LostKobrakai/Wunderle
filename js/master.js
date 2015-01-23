var Mustache = Mustache || null,
		Modernizr = Modernizr || null,
		tree = [];

var theme = {
	contentContainer: null,
	ajax: false,
	win: null,

	init: function(){
		console.log("init");
		this.breadcrumb.container = $(".breadcrumb").first();
		this.win = $(window);
		this.contentContainer = $("#content");
		this.navigation.navigations = $(".mainnav").first();
		this.navigation.navigations.add($(".footernav").first());

		if( Modernizr.history ){
			this.ajax = true;
		}

		this.templates = window.templates || null;

		this.listeners.init();

		$(window).ready(function(){
			console.log("ready");
			theme.template.initStartTemplate();
			theme.rendering.currentTemplate = theme.initTemplate;
		});
	},

	listeners: {
		init: function(){
			theme.win.on("click", "a[href]:not([href^='http://']):not([href^='https://'])", this.internalPageLink);
			theme.win.on("popstate", this.statePoped);
		},

		statePoped: function(e){
			if(e.state){
				theme.rendering.renderMustache(e.state);
			}
		},

		internalPageLink: function(e){
			if(theme.ajax){
				var ele = $(this),
						href = ele.attr("href");

				if(href.charAt(0) !== "#"){
					e.preventDefault();
					if(ele.attr("data-href")){
						href = ele.attr("data-href");
					}
					if(theme.navigation.navigations.find(ele).length){
						theme.navigation.initialNavChange(ele);
					}
					theme.rendering.preRendering(href, ele.attr("data-template"), ele.text());
				}
			}
		}
	},

	rendering: {
		currentTemplate: null,

		preRendering: function(url, template, title){
			if(url === window.location.pathname){
				return false;
			}
			theme.contentContainer.css("opacity", "0.4");

			//Do I need to search for JSON Data?
			if(["projects", "project-category"].indexOf(this.currentTemplate) !== -1 && ["projects", "project-category"].indexOf(template) !== -1){
				this.renderProjectCategorySwitch(template, url, title);
			}else{
				theme.history.searchPageLocal(url);
			}
		},

		renderMustache: function(page){
			var html = templates[page.renderAs].render(page.data, templates);
			theme.contentContainer.html(html);
			this.afterRendering(page);
		},

		renderProjectCategorySwitch: function(template, url, title){
			var page = history.state || theme.initData,
					projects = page.data.projects,
					//currentUrl = window.location.pathname,
					current, offset, oldPos = [], newPos = [],
					container = $(".gridlist"),
					i;

			if(template === "projects"){
				page.parents.length = 1;

				for (i = projects.length - 1; i >= 0; i--) {
					projects[i].inactive = false;
				}
			}else{
				if(this.currentTemplate === "projects"){
					page.parents.length = 2;
					page.parents.push({
						title: page.title,
						url: page.url
					});
				}

				for (i = projects.length - 1; i >= 0; i--) {
					if(projects[i].meta_type.url !== url){
						projects[i].inactive = true;
					}else{
						projects[i].inactive = false;
					}
				}
			}
			page.parents = page.parents.filter(function(){return true;});

			projects.sort(function(a, b){
				if(a.inactive && !b.inactive){
					return 1;
				}else if(!a.inactive && b.inactive){
					return -1;
				}else{
					return a.title > b.title ? 1 : -1;
				}
			});

			for (i = 0; i < projects.length; i++) {
				current = $("#item_"+projects[i].id).closest("li");
				if(projects[i].inactive && !current.hasClass("inactive")){
					current.addClass("inactive");
				}else if(!projects[i].inactive && current.hasClass("inactive")){
					current.removeClass("inactive");
				}
				offset = current.offset();

				oldPos[i] = {
					'position': 'absolute',
					'top': offset.top+"px",
					'left': offset.left+"px",
					'width': offset.width+"px",
					'height': offset.height+"px"
				};

				if(!projects[i].inactive){
					current.remove().appendTo($(".gridlist").eq(0));
				}else{
					current.remove().appendTo($(".gridlist--inactive").eq(0));
				}
			}
			
			for (i = 0; i < projects.length; i++) {
				current = $("#item_"+projects[i].id).closest("li");
				current.removeAttr("style");
				offset = current.offset();
				newPos[i] = {
					'top': offset.top+"px",
					'left': offset.left+"px"
				};
			}

			container.css("height", container.height());
			window.setTimeout(function(){
				container.removeAttr("style");
			}, 230);

			for (i = 0; i < projects.length; i++) {
				current = $("#item_"+projects[i].id).closest("li");
				current.css(oldPos[i]).velocity(newPos[i], {
					duration: 200,
					complete: function(ele){
						$(ele).removeAttr("style");
					}
				});
			}

			$("h1").text(title);


			page.url = url;
			page.template = template;
			page.title = title;
			page.projects = projects;
			this.afterRendering(page);
			theme.history.addState(page, page.title, page.url);
		},

		afterRendering: function(page){
			theme.contentContainer.css("opacity", "1");
			this.currentTemplate = page.template;
			theme.navigation.updateNavigation(page);
			theme.breadcrumb.renderBreadcrumb(page);
			document.title = page.title;
			theme.template.initPerTemplate(page.template);
		}
	},

	history: {
		renderState: function(page, newState){
			if(newState){
				this.addState(page, page.title, page.url);
			}else{
				theme.rendering.renderMustache(page);
			}
		},

		stateChanged: function(state){
			console.log(state);
		},

		addState: function(page, title, url){
			history.pushState(page, title, url);
		},

		searchPageLocal: function(url){
			// TODO: Add cache expiring

			if(typeof tree[url] !== 'undefined'){
				var page = tree[url];
				theme.rendering.renderMustache(page);
				theme.history.addState(page, page.title, page.url);
			}else{
				this.loadPage(url);
			}
		},

		loadPage: function(url){
			$.getJSON(url, function(page){
				tree[page.url] = page;
				theme.rendering.renderMustache(page);
				theme.history.addState(page, page.title, page.url);
			});
		}
	},

	breadcrumb: {
		container: null,

		renderBreadcrumb: function(page){
			var breadcrumb = templates.breadcrumb.render({parents: page.parents, current: page});
			this.container.html(breadcrumb);
			this.showBreadcrumb();
		},

		hideBreadcrumb: function(){
			if(this.container.css("visibility") !== "hidden"){
				this.container.css("visibility", "hidden");
			}
		},

		showBreadcrumb: function(){
			if(this.container.css("visibility") === "hidden"){
				this.container.css("visibility", "visible");
			}
		}
	},

	navigation: {
		navigations: null,

		updateNavigation: function(page){
			var urls = [page.url];

			for (var i = page.parents.length - 1; i >= 0; i--) {
				urls.push(page.parents[i].url);
			}

			// Class "active"
			this.navigations.find(".active").removeClass("active").removeClass("current");
			this.navigations.find("a").each(function(){
				if(urls.indexOf( $(this).attr("href") ) !== -1){
					$(this).closest("li").addClass("active");
				}
			});

			// Class "current"
			this.navigations.find("a[href='"+page.url+"']").addClass("current");
		},

		initialNavChange: function(ele){
			this.navigations.find(".active").removeClass("active").removeClass("current");
			ele.closest("li").addClass("active");
			if(ele.parents(".mainnav__secondlevel").length){
				ele.parents(".mainnav__secondlevel").closest("li").addClass("active");
			}
		}
	},

	template: {

		initStartTemplate: function(){
			this.initPerTemplate(theme.initTemplate);
		},

		initPerTemplate: function(template){
			console.log("initTemplate");
			if(template == "home"){
				this.initHome();
			}else if(template === "contact"){
				this.initContact();
			}
		},

		initHome: function(){

			theme.breadcrumb.hideBreadcrumb();


			// News
			function toggle(e){
				var ele = $(this),
						content = ele.find(".content").first(),
						height,
						duration = 200;

				if(e === undefined || e === false || e === null){
					duration = 0;
				}

				if(ele.hasClass("js-open")){ // Close
					height = "0px";

					if(ele.is(":first-child")){
						var children = content.children();
						children.not(children.first()).not(children.eq(1)).hide();
						height = content.height();
						children.show();
					}

					content.velocity(
						{
							height: height
						}, {
							duration: duration,
							easing: "ease-in-out",
							complete: function(){
								ele.find(".js-togglenews").text("Artikel lesen");
								ele.removeClass("js-open");
							}
					});
				}else{ // Open
					var old = content.height();
					height = content.removeAttr("style").height();

					content.css("height", old).velocity(
						{
							height: height
						}, {
							duration: duration,
							easing: "ease-in-out",
							complete: function(){
								ele.find(".js-togglenews").text("Schließen");
								ele.addClass("js-open");
								content.removeAttr("style");
							}
					});
				}
			}

			if(window.canvas !== undefined){
				window.canvas.init();
				console.log(window.canvas);
			}

			var articles = $(".news").addClass("js-open").on("click", toggle);

			for (var i = articles.length - 1; i >= 0; i--) {
				toggle.apply(articles.eq(i), []);
			}

			// Slideshow

			// var slideshow = $(".slideshow").eq(0),
			// 		slides = slideshow.find(".slide"),
			// 		wrapper = slideshow.find(".slide-wrapper");

			// var slideshowData = [];

			// for (i = 0; i < slides.length; i++) {
			// 	slideshowData.push({
			// 		image: slides.eq(i).find("img").eq(0).clone(),
			// 		title: slides.eq(i).find(".side-headlines").eq(0).clone()
			// 	});

			// 	if(i === 0){
			// 		wrapper.before(slideshowData[i].title);
			// 		wrapper.append(slideshowData[i].image.addClass("slider-image"));
			// 	}else{
			// 		wrapper.append(slideshowData[i].image.addClass("slider-image").addClass("slide--hidden"));
			// 	}

			// 	slides.eq(i).remove();
			// }

			(function slideToNext(){
				// var next = (active + 1 + slideshowData.length) % slideshowData.length,
				// 		headline = slideshow.find(".side-headlines").eq(0);

				// slideshowData[next].image.addClass("slide--absolute").removeClass("slide--hidden");
				// slideshowData[active].image.css("position", "relative")
				// 	.velocity({
				// 		"right": 1000
				// 	},{
				// 		duration: 300,
				// 		complete: function(){
				// 			headline.html(slideshowData[next].title.html());
				// 			slideshowData[next].image.removeClass("slide--absolute");
				// 			slideshowData[active].image.addClass("slide--hidden").removeAttr("style");
				// 		}
				// 	});

				setTimeout(function(){ slideToNext(); } , 5000);
			})();
		},

		initContact: function(){

			function initMap(){
				var L = window.L || null;
				// create a map in the "map" div, set the view to a given place and zoom
				var map = L.map('map', {scrollWheelZoom: false}).setView([48.37628, 10.8350], 15);

				// add an OpenStreetMap tile layer
				L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
							maxZoom: 18,
							attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
								'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
								'Imagery © <a href="http://mapbox.com">Mapbox</a>',
							id: 'examples.map-i875mjb7'
						}).addTo(map);

				// add a marker in the given location, attach some popup content to it and open the popup
				L.marker([48.37628, 10.82801]).addTo(map)
				    .bindPopup('<b>WUNDERLE + PARTNER</b> Architekten <br> Am Dreieck 6<br>86356 Neusäß/Steppach')
				    .openPopup();
			}

			if(window.L !== undefined){
				initMap();
			}else{
				$(window).ready(function(){
					initMap();
				});
			}
		}
	}
};

theme.init();