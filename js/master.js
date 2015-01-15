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
	},

	listeners: {
		init: function(){
			theme.win.on("click", "a:not([href^='http://']):not([href^='https://'])", this.internalPageLink);
			theme.win.on("popstate", this.statePoped);
		},

		statePoped: function(e){
			if(e.state){
				theme.history.renderState(e.state, false);
			}
		},

		internalPageLink: function(e){
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
				theme.history.searchPageLocal(href);
			}
		}
	},

	history: {
		renderState: function(page, newState){
			// Render content with mustache
			var html = templates[page.template].render(page.data, templates);
			theme.contentContainer.html(html);
			theme.contentContainer.css("opacity", "1");

			//Update some States
			theme.navigation.updateNavigation(page);
			theme.breadcrumb.renderBreadcrumb(page);
			theme.template.initPerTemplate(page.template);
			if(newState){
				this.addState(page, page.title, page.url);
			}
		},

		stateChanged: function(state){
			console.log(state);
		},

		addState: function(page, title, url){
			history.pushState(page, title, url);
		},

		searchPageLocal: function(url){
			theme.contentContainer.css("opacity", "0.4");
			if(typeof tree[url] !== 'undefined'){
				var page = tree[url];
				this.renderState(page, true);
			}else{
				this.loadPage(url);
			}
		},

		loadPage: function(url){
			$.getJSON(url, function(page){
				tree[page.url] = page;
				theme.history.renderState(page, true);
			});
		}
	},

	breadcrumb: {
		container: null,

		renderBreadcrumb: function(page){
			var breadcrumb = templates.breadcrumb.render({parents: page.parents, current: page});
			this.container.html(breadcrumb);
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
		initPerTemplate: function(template){
			if(template == "home"){
				this.initHome();
			}
		},

		initHome: function(){
			var articles = $(".articles");

			for (var i = articles.length - 1; i >= 1; i--) {
				articles[i].find(".content").children().not(':first').hide();
			}
		}
	}
};

theme.init();