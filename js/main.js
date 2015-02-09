// Load Dependencies

$script.path('/site/templates/js/');

if(document.getElementsByTagName("html")[0].className.match(/ie/)){
	$script('libs/jquery', 'jQuery');
}else{
	$script('libs/zepto', 'Zepto');
}

$script
	.ready('jQuery', function(){

		if(Modernizr.history){
			$script('libs/hogan.min', function(){
				$script(['templates', 'partials'], 'templating');
			});
		}

		$script('libs/velocity.min', function(){
			$script('libs/velocity.ui.min', 'velocity');
		});

	}).ready('Zepto', function(){

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
	var win = $(window),
			navigations = $(".mainnav").first().add($(".footernav").first();

	function internalPageLinkClicked(e){
		e.preventDefault();

		// Close mobile Nav
		theme.mainnav.removeClass("mainnav--open");

		// AJAX
		var ele = $(this), href = ele.attr("href");

		if(ele.attr("data-href")){
			href = ele.attr("data-href");
		}
		if(navigations.find(ele).length){
			initialNavChange(ele);
		}
		//theme.rendering.preRendering(href, ele.attr("data-template"), ele.text());
	}

	win.on("click", "a[href]:not([href^='http://']):not([href^='https://']):not([href^='#']):not([target])", internalPageLinkClicked);
});