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