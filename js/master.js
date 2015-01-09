var Mustache = Mustache || null;

var theme = {
	breadcrumbWrapper: null,
	currentTemplate: null,

	init: function(){
		$(".mainnav").on("click", "a", this.stuff);
		this.console = window.console || null;
		this.console.log(window.templates);
		this.breadcrumbWrapper = $(".breadcrumb").first();
	},

	stuff: function(e){
		e.preventDefault();

		var ele = $(this);
		$.getJSON(ele.attr("href"), function(data){
			this.console.log(data);
			var templates = window.templates || null;
			var html = templates[data.template].render(data.data, templates);
			var breadcrumb = templates.breadcrumb.render(data.breadcrumb);
			theme.breadcrumbWrapper.first().html(breadcrumb);
			theme.aniSiteChange(html);
			history.pushState({}, data.title, ele.attr("href"));
			theme.currentTemplate = data.template;
			$(".mainnav").find(".active").removeClass("active");
			ele.closest("li").addClass("active");
			if(ele.closest(".mainnav__secondlevel").length){
				ele.closest(".mainnav__secondlevel").closest("li").addClass("active");
			}
		});
	},

	aniSiteChange: function(html){
		var content = $("#content");
		content.velocity("transition.slideRightOut", 100, function(){
			content.html(html);
			content.velocity("transition.slideLeftIn", 200);
		});
	}
};

theme.init();