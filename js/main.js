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
			$script(['templates'], 'templating');
		});
	}

	$script(['libs/velocity.min', 'libs/smartresize', 'libs/fuse.min'], function(){
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

// News open / close
$script.ready('velocity', function(){
	initNews();
	if(config.initTemplate == "contact") initMap();
	$(".filter-form input[type='text']").on("change input propertychange paste", searchProject);
	$(".ie8").find(".totheright").find("input").val("Suche…");
});

function initNews(){
	var texts = { 
		"closed": "Artikel lesen",
		"closed_first": "Weiterlesen",
		"open": "Schließen"
	}

	var wrapper = $(".articles");
			articles = wrapper.find(".news");

	articles.addClass("js-closed").removeClass("closed");
	articles.find(".content").height(0);
	wrapper.on("click", ".js-togglenews", toggle);

	function applyHiding(e, animate){
		if(!articles.first().hasClass("js-open")){
			var ele = articles.first(),
					content = ele.find(".content").first(),
					children = content.children(),
					height = 0;

			children.not(children.first()).not(children.eq(1)).hide();
			height = content.removeAttr("style").height();
			children.show();

			if(animate){
				content.height(0);
				content.velocity({"height": height}, 350);
			}else{
				content.css("height", height);
			}
		}
	}

	$(window).smartresize(applyHiding, 50);
	setTimeout(function(){ applyHiding(0, true); }, 200);

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
				if(children.length <= 2){
					ele.find(".js-togglenews").remove();
					return false;
				}
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
						if(ele.is(":first-child")){
							ele.find(".js-togglenews").text(texts["closed_first"]);
						}else{
							ele.find(".js-togglenews").text(texts["closed"]);
						}
						ele.removeClass("js-open").addClass("js-closed");
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
						ele.find(".js-togglenews").text(texts["open"]);
						ele.addClass("js-open").removeClass("js-closed");
						content.removeAttr("style");
					}
			});
		}
	}
}

var searchCache = "";

function searchProject(){
	var ele = $(this),
			search = ele.val().toLowerCase();

	if(search == "suche…") return;

	if(searchCache !== search){
		searchCache = search;

		var page = history.state || config.initData,
				projects = page.data.projects,
				i,
				foundSomething = false;

		for (i = projects.length - 1; i >= 0; i--) {
			var searchIn = [
				//projects[i].meta_type.title.toLowerCase(),
				projects[i].title.toLowerCase()
			], j = 0, foundInProject = false;

			projects[i].inactive = true;

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
				keys: ['title'], //, 'meta_type.title'],
				id: 'id',
				threshold: 0.4,
				distance: 80
			});

			var result = f.search(search);

			for (i = projects.length - 1; i >= 0; i--) {
				projects[i].inactive = true;
				if(result.indexOf(projects[i].id) !== -1){
					projects[i].inactive = false;
				}else{
					projects[i].inactive = true;
				}
			}

			if(result.length !== projects.length && result.length !== 0){
				foundSomething = true;
			}

			//console.log(result.length, projects.filter(function(p){ return p.inactive == false; }).length);
		}

		if(foundSomething) animateProjectStatusChange(projects);
	}
}

// Load news via ajax

$script.ready(['templating', 'velocity'], function(){
	var button = $(".js-load-news").on("click", newsloader.loadNewsEntries);
	button.text("Weitere Einträge laden");
});

newsloader = {
	current: 1,
	max: null,

	renderNewNewsItems: function(page){
		this.current++;
		if(this.max == null || parseInt(page.data.limit) > this.max){
			this.max = parseInt(page.data.limit);
		}

		var html = "", news = page.data.news;
		for (var i = 0; i < news.length; i++) {
			html += templates["news-item"].render(news[i], templates);
		}

		$(".js-load-news").before(html);

		var articles = $(".news").filter(".closed");
		articles.addClass("js-closed").removeClass("closed");
		articles.find(".content").height(0);

		if(this.current == this.max){
			$(".js-load-news").remove();
		}
	},

	ajax: function(){
		$.ajax({
			type: 'GET',
			url: window.location.href+"page"+(this.current + 1),
			dataType: 'json',
			timeout: 2000,
			success: function(page){
				newsloader.renderNewNewsItems(page);
			},
			error: function(){
				alert("Fehler beim Laden neuer Einträge");
			}
		});
	},

	loadNewsEntries: function(e){
		e.preventDefault();
		e.stopPropagation();

		newsloader.ajax();
	}

};

function animateProjectStatusChange(projects){
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

	container.each(function(){
		var ele = $(this);
		ele.css("height", ele.height());
	})
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
}

function initMap(){

	if(window.L === undefined && $("#leaflet_script").length === 0){
		var $script = $("<script/>").attr("src", "//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js").attr("id", "leaflet_script");
		$script.on("load", initMap);
		$("body").append($script);
	}else{
		setTimeout(initMap, 50);
	}

	var L = window.L || null;
	if(L === null){
		return false;
	}
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