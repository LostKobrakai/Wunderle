var Mustache = Mustache || null,
		Modernizr = Modernizr || null;

var tree = [];

var theme = {
	contentContainer: null,
	ajax: false,
	win: null,

	init: function(){
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
					theme.rendering.preRendering(href, ele.attr("data-template"));
				}
			}
		}
	},

	rendering: {
		currentTemplate: null,

		preRendering: function(url, template){
			theme.contentContainer.css("opacity", "0.4");

			//Do I need to search for JSON Data?
			if(this.currentTemplate == "projects" && ["projects", "project-category"].indexOf(template) !== -1){
				console.log(this.currentTemplate+" -> "+template);
				this.renderProjectCategorySwitch(template, url);
			}else{
				theme.history.searchPageLocal(url);
			}
		},

		renderMustache: function(page){
			var html = templates[page.template].render(page.data, templates);
			theme.contentContainer.html(html);
			this.afterRendering(page);
		},

		renderProjectCategorySwitch: function(template, url){
			var page = history.state || theme.initData,
					projects = page.data.projects,
					inactive = page.data.inactive,
					attrs,
					i;

			if(template === "projects"){
				for (i = inactive.length - 1; i >= 0; i--) {
					if(inactive[i].meta_type.url === url){
						projects.push(inactive[i]);
						inactive.splice(i, 1);
					}
				}

				for (i = projects.length - 1; i >= 0; i--) {
					attrs = [];
					attrs.push("position: absolute");
					attrs.push("width: "+projects[i].width()+"px");
					attrs.push("height: "+projects[i].height()+"px");
					attrs.push("width: "+projects[i].width()+"px");
					projects[i].attr("data-style", attrs.join("; "));
					console.log($("#item_"+projects[i].data.id).offset());
				}
			}else{
				for (i = projects.length - 1; i >= 0; i--) {
					console.log($("#item_"+projects[i].id).offset());
					if(projects[i].meta_type.url !== url){
						inactive.push(projects[i]);
						projects.splice(i, 1);
					}
				}
				for (i = inactive.length - 1; i >= 0; i--) {
					if(inactive[i].meta_type.url === url){
						projects.push(inactive[i]);
						inactive.splice(i, 1);
					}
				}
			}

			for (i = 0; i < projects.length; i++) {
				//projects[i]
			}

			page.template = "projects";
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
			if(template == "home"){
				this.initHome();
			}
		},

		initHome: function(){

			theme.breadcrumb.hideBreadcrumb();

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

			var articles = $(".news").addClass("js-open").on("click", toggle);

			for (var i = articles.length - 1; i >= 0; i--) {
				toggle.apply(articles.eq(i), []);
			}
		}
	}
};

theme.init();