var Mustache = Mustache || null;

var theme = {
	init: function(){
		$("nav").on("click", "a", this.stuff);
		this.console = window.console || null;
		this.console.log(window.templates);
	},

	stuff: function(e){
		e.preventDefault();

		var ele = $(this);
		$.getJSON(ele.attr("href"), function(data){
			this.console.log(data);
			var templates = window.templates || null;
			var html = templates[data.template].render(data.data, templates);
			this.console.log(templates[data.template]);
			theme.aniSiteChange(html);
			history.pushState({}, data.title, ele.attr("href"));
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