var console = console || null,
		Mustache = Mustache || null;

var theme = {
	init: function(){
		$("nav").on("click", "a", this.stuff);
	},

	stuff: function(e){
		e.preventDefault();
		var ele = $(this);
		$.getJSON(ele.attr("href"), function(data){
			var tpl = ele.attr("data-template");

			if($("#"+tpl).length){
				console.log("Load "+tpl+" from html.");

				var template = $("#"+tpl).html();
				var html = Mustache.to_html(template, data);
				theme.aniSiteChange(html);
				history.pushState({}, data.title, ele.attr("href"));

			}else{
				console.log("Load "+tpl+" from online template.");

				$.get("/site/templates/views/"+tpl+".mustache", function(template){
					var script = $("<script />");
					script.attr("id", tpl);
					script.attr("type", "text/html");
					script.html(template);
					$("body").append(script);

					var html = Mustache.to_html(template, data);
					theme.aniSiteChange(html);
					history.pushState({}, data.title, ele.attr("href"));
				});
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