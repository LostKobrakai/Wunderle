var Mustache = Mustache || null;

var theme = {
	breadcrumbWrapper: null,
	currentTemplate: null,
	content: null,
	console: null,

	init: function(){
		$(".mainnav").on("click", "a", this.goToPage);
		this.console = window.console || null;
		this.console.log(window.templates);
		this.breadcrumbWrapper = $(".breadcrumb").first();
		this.content = $("#content");
	},

	goToPage: function(e){
		e.preventDefault();

		var ele = $(this);

		if(ele.attr("data-href") !== null){
			ele = $("[href='"+ele.attr("data-href")+"']").first();
			theme.loadPage(ele);
		}else if(["projects", "project-category"].indexOf(theme.currentTemplate) !== -1 &&
						 ["projects", "project-category"].indexOf(ele.attr("data-template")) !== -1 ){
			theme.sortProjects(ele.attr("data-title"));
			$.getJSON(ele.attr("href")+"?breadcrumbOnly=1", function(data){
				theme.updateBreadcrumb(data.breadcrumb);
				theme.updateNavigation(data.breadcrumb);
				theme.updateUrl(ele.attr("href"), data.template);
				theme.currentTemplate = ele.attr("data-template");
			});
		}else{
			theme.loadPage(ele);
		}

	},

	loadPage: function(ele){
		theme.content.css("opacity", 0.4);
		var href = ele.attr("href");

		$.getJSON(href, function(data){
			var templates, html;

			templates = window.templates || null;
			html = templates[data.template].render(data.data, templates);
			theme.updateBreadcrumb(data.breadcrumb);
			theme.updateNavigation(data.breadcrumb);

			theme.aniSiteChange(html);
			theme.updateUrl(href, data.template);
			theme.currentTemplate = ele.attr("data-template");
		});
	},

	updateBreadcrumb: function(data){
		var breadcrumb = templates.breadcrumb.render(data);
		theme.breadcrumbWrapper.first().html(breadcrumb);
	},

	updateNavigation: function(data){
		//Reset
		$(".mainnav").find(".active").removeClass("active");

		for (var i = data.breadcrumb.length - 1; i >= 0; i--) {
			$("[href='"+data.breadcrumb[i].url+"']").closest("li").addClass("active");
		}

	},

	updateUrl: function(url, name){
		history.pushState({}, name, url);
	},

	aniSiteChange: function(html){
		var content = theme.content;
		content.velocity("transition.slideRightOut", 100, function(){
			content.html(html);
			content.css("opacity", 1);
			content.velocity("transition.slideLeftIn", 200);
		});
	},

	sortProjects: function(type){
		var active = $(".gridlist").first(),
				inactive = $(".gridlist--inactive"),
				i, ele, elements; 

		theme.console.log(type, inactive.children().length);
		if(type === null && inactive.children().length > 0){
			for (i = 0; i < inactive.children().length; i++) {
				ele = inactive.children()[i];
				active.append(ele);
			}
		}else if(type !== null){
			elements = active.children();
			elements = elements.not(function(i){
				i++;
				if($(this).children().first().attr("data-type") === type){
					return true;
				}else{
					return false;
				}
			});

			for (i = 0; i < elements.length; i++) {
				ele = elements[i];
				inactive.append(ele);
			}

			elements = inactive.children();
			elements = elements.filter(function(i){
				i++;
				if($(this).children().first().attr("data-type") === type){
					return true;
				}else{
					return false;
				}
			});

			for (i = 0; i < elements.length; i++) {
				ele = elements[i];
				active.append(ele);
			}
		}
	}
};

theme.init();