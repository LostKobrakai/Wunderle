// Load Dependencies

$script.path('/site/templates/js/');

if(document.getElementsByTagName("html")[0].className.match(/ie/)){
	$script('libs/jquery', 'jQueryZepto');
}else{
	$script('libs/zepto', 'jQueryZepto');
}

$script.ready('jQueryZepto', function(){

	if(Modernizr.history){
		$script('libs/hogan.min', function(){
			$script(['templates', 'partials'], 'templating');
		});
	}

	$script('libs/velocity.min', function(){
		$script('libs/velocity.ui.min', 'velocity');
	});

	$script('libs/smartresize');

});

// Load App

$script.ready('templating', function(){
	$script('app', 'app');
});

// Mobile navigation toggle
$script.ready('velocity', function(){
	var mainnav = $(".mainnav").first();
	$(".js-toggleMobileNav").on("click", function(e){
		e.preventDefault();

		if(mainnav.hasClass("mainnav--open")){
			mainnav.velocity({height: "3em"},{
				duration: 100,
				complete: function(){
					mainnav.removeClass("mainnav--open");
					mainnav.removeAttr("style");
				}
			});
		}else{
			var firstLevel = mainnav.find(".mainnav__firstlevel"),
					animateTo = mainnav.height() + firstLevel.height();

			mainnav.velocity({height: animateTo},{
				duration: 200,
				complete: function(){
					mainnav.addClass("mainnav--open");
					mainnav.removeAttr("style");
				}
			});
		}
	});

	mainnav.on("click", "a", function(){
		mainnav.removeClass("mainnav--open")
	});
});

// News open / close
/*$script.ready('velocity', function(){
	var articles = $(".articles").find(".news");

	// 
	articles.addClass("js-open");
	articles.on("click", ".js-togglenews", toggle);

		function initNews(){
			var i;

			var articles = $(".articles").find(".news");
			articles.addClass("js-open");
			articles.on("click", ".js-togglenews", toggle);

			for (i = articles.length - 1; i >= 0; i--) {
				this.toggle.apply(articles.eq(i), []);
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

			// News AJAX loader

			var button = $(".js-load-news").on("click", theme.listeners.loadNewsEntries);

			button.text("Weitere Einträge laden");
		},

		toggle: function(e){
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
						if(children.length <= 2){
							ele.find(".js-togglenews").remove();
							return false;
						}
						children.not(children.first()).not(children.eq(1)).hide();
						height = content.height();
						//children.find("img").
						children.show();
					}

					content.velocity(
						{
							height: height
						}, {
							duration: duration,
							easing: "ease-in-out",
							complete: function(){
								if(ele.is(":first-child")){
									ele.find(".js-togglenews").text("Weiterlesen");
								}else{
									ele.find(".js-togglenews").text("Artikel lesen");
								}
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
});*/