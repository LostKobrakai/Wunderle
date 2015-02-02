var Mustache = Mustache || null,
		Modernizr = Modernizr || null,
		Fuse = Fuse || null,
		tree = [];

var theme = {
	contentContainer: null,
	ajax: false,
	win: null,
	mainnav: null,

	init: function(){
		this.breadcrumb.container = $(".breadcrumb").first();
		this.win = $(window);
		this.mainnav = $(".mainnav").first();
		this.contentContainer = $("#content");
		this.navigation.navigations = $(".mainnav").first();
		this.navigation.navigations.add($(".footernav").first());

		if( Modernizr.history ){
			this.ajax = true;
		}

		this.templates = window.templates || null;

		this.listeners.init();

		$(window).ready(function(){
			theme.template.initStartTemplate();
			theme.rendering.currentTemplate = theme.initTemplate;
		});
	},

	listeners: {
		cache: {
			searchfield: null
		},

		init: function(){
			theme.win.on("click", "a[href]:not([href^='http://']):not([href^='https://'])", this.internalPageLink);
			theme.win.on("popstate", this.statePoped);
			$(".js-toggleMobileNav").on("click", this.mobileMenuToggle);
			$(".filter-form input[type='text']").on("change input propertychange paste", this.searchProject);
		},

		mobileMenuToggle: function(e){
			e.preventDefault();

			if(theme.mainnav.hasClass("mainnav--open")){
				theme.mainnav.velocity({height: "3em"},{
					duration: 100,
					complete: function(){
						theme.mainnav.removeClass("mainnav--open");
						theme.mainnav.removeAttr("style");
					}
				});
			}else{
				var firstLevel = theme.mainnav.find(".mainnav__firstlevel"),
						animateTo = theme.mainnav.height() + firstLevel.height();

				theme.mainnav.velocity({height: animateTo},{
					duration: 200,
					complete: function(){
						theme.mainnav.addClass("mainnav--open");
						theme.mainnav.removeAttr("style");
					}
				});
			}
		},

		statePoped: function(e){
			if(e.state){
				theme.rendering.renderMustache(e.state);
			}
		},

		internalPageLink: function(e){
			theme.mainnav.removeClass("mainnav--open");
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
		},

		searchProject: function(){
			var ele = $(this),
					search = ele.val().toLowerCase();
			if(theme.listeners.cache.searchfield !== search){
				theme.listeners.cache.searchfield = search;

				var page = history.state || theme.initData,
						projects = page.data.projects,
						i,
						foundSomething = false;

				for (i = projects.length - 1; i >= 0; i--) {
					var searchIn = [
						projects[i].meta_type.title.toLowerCase(),
						projects[i].title.toLowerCase()
					], j = 0, foundInProject = false;

					while(j < searchIn.length){
						if(searchIn[j].indexOf(search) !== -1){
							foundInProject = true;
							break;
						}
						j++;
					}

					if(foundInProject){
						projects[i].inactive = false;
						foundSomething = true;
					}else{
						projects[i].inactive = true;
					}
				}

				if(!foundSomething){
					var f = new Fuse(projects, {
						keys: ['title', 'meta_type.title'],
						id: 'id'
					});

					var result = f.search(search);
					console.log(result);

					for (i = projects.length - 1; i >= 0; i--) {
						if($.inArray(projects[i].id, result)){
							projects[i].inactive = false;
						}else{
							projects[i].inactive = true;
						}
					}
				}

				theme.rendering.renderProjectStatusChange(projects);
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
					i;
					//currentUrl = window.location.pathname,

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

			this.renderProjectStatusChange(projects);

			$("h1").text(title);


			page.url = url;
			page.template = template;
			page.title = title;
			page.projects = projects;
			this.afterRendering(page);
			theme.history.addState(page, page.title, page.url);
		},

		renderProjectStatusChange: function(projects){
			var current, offset, oldPos = [], newPos = [],
					container = $(".gridlist"),
					i;

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
		},

		afterRendering: function(page){
			theme.contentContainer.css("opacity", "1");
			this.currentTemplate = page.template;
			theme.navigation.updateNavigation(page);
			theme.breadcrumb.renderBreadcrumb(page);
			document.title = page.title;
			theme.template.initPerTemplate(page.template);

			if(theme.contentContainer.offset().top < theme.win.scrollTop()){
				theme.contentContainer.velocity("scroll", {duration: 150, easing: "ease-in", offset: -70});
			}
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
			// cache for 15 minutes
			if(typeof tree[url] !== 'undefined' && Math.floor(Date.now() / 1000) <= parseInt(tree[url].cache) + 900){
				var page = tree[url];
				theme.rendering.renderMustache(page);
				theme.history.addState(page, page.title, page.url);
			}else{
				this.loadPage(url);
			}
		},

		loadPage: function(url){
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				timeout: typeof tree[url] !== 'undefined' ? 2000 : 0,
				success: function(page){
					tree[page.url] = page;
					theme.rendering.renderMustache(page);
					theme.history.addState(page, page.title, page.url);
				},
				error: function(){
					if(typeof tree[url] !== 'undefined'){
						var page = tree[url];
						page.cache = Math.floor(Date.now() / 1000);
						theme.rendering.renderMustache(page);
						theme.history.addState(page, page.title, page.url);
					}else{
						alert("Fehler beim Laden der Seite");
					}
				}
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
			if(template == "home"){
				this.initHome();
			}else if(template === "contact"){
				this.initContact();
			}
		},

		initHome: function(){
			var i;

			theme.breadcrumb.hideBreadcrumb();


			// News
			function toggle(e){
				if(e && e.preventDefault){
					e.preventDefault();
					e.stopPropagation();
				}
				var ele = $(this).closest(".news"),
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

			var articles = $(".news");
			articles.addClass("js-open");
			articles.find(".js-togglenews").on("click", toggle);

			for (i = articles.length - 1; i >= 0; i--) {
				toggle.apply(articles.eq(i), []);
			}

			function applyHiding(){
				if(!articles.first().hasClass("js-open")){
					var ele = articles.first(),
							content = ele.find(".content").first(),
							children = content.children(),
							height = 0;

					children.not(children.first()).not(children.eq(1)).hide();
					height = content.removeAttr("style").height();
					children.show();

					content.css("height", height);
				}
			}

			theme.win.smartresize(applyHiding, 50);
			applyHiding();

			// Slideshow

			var slideshow = $(".slideshow").eq(0),
					slides = slideshow.find(".slide");

			slideshow.find(".slide-wrapper").addClass("slide-wrapper--overflow");

			for (i = slides.length - 1; i >= 0; i--) {
				if(i === 0){
					slides.eq(i).addClass("slide--active");

					var headline = slides.eq(i).find(".side-headlines").eq(0);

					slideshow.find(".slide-wrapper").before($("<div />").addClass("headline-wrapper").addClass("headline-wrapper").html(headline.clone()));
				}else{
					slides.eq(i).addClass("slide--inactive");
				}
			}

			var headwrapper = $(".headline-wrapper");

			setTimeout(function(){
				(function slideToNext(active){
					var next = (active + 1 + slides.length) % slides.length,
							headline = slides.eq(next).find(".side-headlines").eq(0);

					slides.eq(next).addClass("slide--show");

					slides.eq(active).velocity({
						'right': 1000
					},{
						duration: 300,
						complete: function(){
							headwrapper.html(headline.clone());
							slides.eq(next).removeClass("slide--inactive").addClass("slide--active");
							slides.eq(active).addClass("slide--inactive").removeClass("slide--show").removeClass("slide--active").removeAttr("style");
						}
					});

					setTimeout(function(){ slideToNext(next); } , 5000);
				})(0);
			}, 5000);
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