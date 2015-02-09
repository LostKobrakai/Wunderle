var breadcrumb, navigation, win;

//------------------------------------------------------------------------------
// Cache global dom nodes
//------------------------------------------------------------------------------

win = $(window);

//------------------------------------------------------------------------------
// Objects
//------------------------------------------------------------------------------

breadcrumb = {
	wrapper: $(".breadcrumb"),
	currentJSON: null,
	update: function(page){
		templates.breadcrumb.render({parents: page.parents, current: page});
		this.wrapper.html(breadcrumb);
		this.showBreadcrumb();
	},

	hide: function(){
		if(this.wrapper.css("visibility") !== "hidden"){
			this.wrapper.css("visibility", "hidden");
		}
	},

	show: function(){
		if(this.wrapper.css("visibility") === "hidden"){
			this.wrapper.css("visibility", "visible");
		}
	}
};

navigation = {
	navigations: $(".mainnav").first().add($(".footernav").first()),

	afterLoadUpdate: function(page){
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

	instantUpdate: function(ele){
		this.navigations.find(".active").removeClass("active").removeClass("current");
		ele.closest("li").addClass("active");
		if(ele.parents(".mainnav__secondlevel").length){
			ele.parents(".mainnav__secondlevel").closest("li").addClass("active");
		}
	}
};

sites = {
	cache: [],
	loader: function(url){

	}
};


//------------------------------------------------------------------------------
// Event Listener
//------------------------------------------------------------------------------

function internalPageLinkClicked(e){
	e.preventDefault();

	var ele = $(this), href = ele.attr("href");

	if(ele.attr("data-href")){
		href = ele.attr("data-href");
	}
	if(navigation.navigations.find(ele).length){
		navigation.instantUpdate(ele);
	}
	//theme.rendering.preRendering(href, ele.attr("data-template"), ele.text());
}

win.on("click", "a[href]:not([href^='http://']):not([href^='https://']):not([href^='#']):not([target])", internalPageLinkClicked);