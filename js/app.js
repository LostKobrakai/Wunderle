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
		var breadcrumb = templates.breadcrumb.render({parents: page.parents, current: page});
		this.wrapper.html(breadcrumb);
		this.show();
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

loader = {
	cache: [],
	newpage: null,
	newtemplate: null,

	goToPage: function(url, template, title){
		this.newtemplate = template;

		if(["projects", "project-category"].indexOf(currentSite.template) !== -1 && ["projects", "project-category"].indexOf(this.newtemplate) !== -1){
			this.renderProjectCategorySwitch(url, template, title);
			//console.log("no need to search");
		}else{
			this.retrievePage(url);
		}
		//window.location = url;
	},

	retrievePage: function(url){

		// cache for 15 minutes
		if(typeof this.cache[url] !== 'undefined' && Math.floor(Date.now() / 1000) <= parseInt(this.cache[url].cache) + 900){
			this.newpage = this.cache[url];
			this.renderMustachePage();

		}else{
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				timeout: typeof this.cache[url] !== 'undefined' ? 100 : 0, // 100 milliseconds or unlimited
				success: function(page){
					loader.cache[page.url] = page;
					loader.newpage = page;
					loader.renderMustachePage();
				},
				error: function(){
					if(typeof loader.cache[url] !== 'undefined'){
						var page = loader.cache[url];
						page.cache = Math.floor(Date.now() / 1000);
						loader.newpage = page;
						loader.renderMustachePage();
					}else{
						alert("Fehler beim Laden der Seite");
					}
				}
			});

		}
	},

	renderMustachePage: function(newState){
		if(newState === undefined) newState = true;
		var html = templates[this.newpage.renderAs].render(this.newpage.data, templates);
		currentSite.contentContainer.html(html);
		this.afterRendering(newState);
	},

	renderProjectCategorySwitch: function(url, template, title){
		
		var page;
		if(history.state !== null){
			page = history.state;
		}else{
			page = config.initData;
		}

		var projects = page.data.projects,
				i;

		if(template === "projects"){
			page.parents.length = 1;

			for (i = projects.length - 1; i >= 0; i--) {
				projects[i].inactive = false;
			}
		}else{
			if(currentSite.template === "projects"){
				console.log(page.parents);
				while(page.parents.length > 2){
					page.parents.pop();
				}
				page.parents.push({
					title: page.title,
					url: page.url
				});
				console.log(page.parents);
			}

			for (i = projects.length - 1; i >= 0; i--) {
				if(projects[i].meta_type.url !== url){
					projects[i].inactive = true;
				}else{
					projects[i].inactive = false;
				}
			}
		}
		page.parents = page.parents.filter(function(){return true;});

		this.animateProjectStatusChange(projects);

		$("h1").text(title);


		page.url = url;
		page.template = template;
		page.title = title;
		page.projects = projects;
		this.newpage = page;
		this.afterRendering(true);
	},

	animateProjectStatusChange: function(projects){
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
	},

	afterRendering: function(newState){
		currentSite.page = this.newpage;
		currentSite.template = this.newpage.template;
		navigation.afterLoadUpdate(this.newpage);
		breadcrumb.update(this.newpage);
		document.title = this.newpage.title+" – WUNDERLE + PARTNER Architekten";
		//theme.template.initPerTemplate(page.template);

		if(currentSite.contentContainer.offset().top < win.scrollTop()){
			currentSite.contentContainer.velocity("scroll", {duration: 150, easing: "ease-in", offset: -70});
		}
		if(newState) this.addState();
		currentSite.endChange();
	},

	addState: function(){
		history.pushState(this.newpage, this.newpage.title, this.newpage.url);
	}
};

currentSite = {
	contentContainer: $("#content"),
	template: config.initTemplate,
	page: config.initData,

	prepareChange: function(){
		this.contentContainer.css("opacity", "0.4");
	},

	endChange: function(){
		this.contentContainer.css("opacity", "1");

		if(["home", "news-folder", "press"].indexOf(this.template) !== -1){
			initNews();
		}

		if(this.template === "contact"){
			initMap();
		}
	}
}


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
	if(href !== window.location.pathname) loader.goToPage(href, ele.attr("data-template"), ele.text());
}

win.on("popstate", function(e){
	if(e.state){
		loader.newpage = e.state;
		loader.renderMustachePage(false);
	}else{
		loader.goToPage(window.location.pathname, "", "");
	}
});

if(config.initData) history.replaceState(config.initData, config.initData.title, window.location.pathname);

win.on("click", "a[href]:not([href^='http://']):not([href^='https://']):not([href^='#']):not([target])", internalPageLinkClicked);