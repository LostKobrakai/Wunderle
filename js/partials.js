if (!!!templates) var templates = {};
templates["listproject"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<article class=\"listproject\" id=\"item_");t.b(t.v(t.f("id",c,p,0)));t.b("\" data-type=\"");t.b(t.v(t.d("meta_type.title",c,p,0)));t.b("\" data-status=\"");t.b(t.v(t.f("meta_status",c,p,0)));t.b("\">");t.b("\n" + i);t.b("	<div class=\"inner\">");t.b("\n" + i);t.b("		<img src=\"");t.b(t.v(t.d("image.url",c,p,0)));t.b("\" alt=\"");t.b(t.v(t.d("image.desc",c,p,0)));t.b("\">");t.b("\n" + i);t.b("		<div class=\"listproject__desc\">");t.b("\n" + i);t.b("			<h2>");t.b("\n" + i);t.b("				<a href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\" title=\"");t.b(t.v(t.f("title",c,p,0)));t.b("\">");t.b("\n" + i);t.b("					");t.b(t.v(t.f("title",c,p,0)));t.b("\n" + i);t.b("				</a>");t.b("\n" + i);t.b("			</h2>");t.b("\n" + i);t.b("			<span class=\"meta_type\">");t.b("\n" + i);if(t.s(t.d("meta_type.url",c,p,1),c,p,0,363,469,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				<a href=\"");t.b(t.v(t.d("meta_type.url",c,p,0)));t.b("\" title=\"");t.b(t.v(t.d("meta_type.title",c,p,0)));t.b("\">");t.b("\n" + i);t.b("					");t.b(t.v(t.d("meta_type.title",c,p,0)));t.b("\n" + i);t.b("				</a>");t.b("\n" + i);});c.pop();}if(!t.s(t.d("meta_type.url",c,p,1),c,p,1,0,0,"")){t.b("				");t.b(t.v(t.d("meta_type.title",c,p,0)));t.b("\n" + i);};t.b("			</span>");t.b("\n" + i);t.b("		</div>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</article>");return t.fl(); },partials: {}, subs: {  }});
templates["meta"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<ul class=\"metadata\">");t.b("\n" + i);if(t.s(t.f("meta",c,p,1),c,p,0,34,74,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<li><b>");t.b(t.v(t.f("name",c,p,0)));t.b("</b><br>");t.b(t.v(t.f("value",c,p,0)));t.b("\n" + i);});c.pop();}t.b("</ul>");return t.fl(); },partials: {}, subs: {  }});
templates["news"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<article class=\"news\">");t.b("\n" + i);t.b("		<h3 class=\"h4\">");t.b("\n" + i);t.b("			<a href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\" title=\"");t.b(t.v(t.f("title",c,p,0)));t.b("\"></a>");t.b("\n" + i);t.b("				");t.b(t.v(t.f("title",c,p,0)));t.b("\n" + i);t.b("			</a>");t.b("\n" + i);t.b("		</h3>");t.b("\n" + i);t.b("		<div class=\"content\">");t.b("\n" + i);t.b("			");t.b(t.t(t.f("content",c,p,0)));t.b("\n" + i);t.b("		</div>");t.b("\n" + i);t.b("		<footer>");t.b("\n" + i);t.b("			<span class=\"date\">");t.b(t.v(t.f("date",c,p,0)));t.b("</span> <a class=\"js-togglenews button align-right\">Schließen</a>");t.b("\n" + i);t.b("		</footer>");t.b("\n" + i);t.b("	</article>");return t.fl(); },partials: {}, subs: {  }});
templates["partner"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<section class=\"partner\">");t.b("\n" + i);t.b("	<header>");t.b("\n" + i);t.b("		<h2 class=\"headline_2 no-margin\">");t.b(t.v(t.f("title",c,p,0)));t.b("</h2>");t.b("\n" + i);t.b("		<span class=\"position\">(");t.b(t.v(t.f("position",c,p,0)));t.b(")</span>");t.b("\n" + i);t.b("		<span class=\"degree\">");t.b(t.v(t.f("degree",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("	</header>");t.b("\n" + i);t.b("	");t.b(t.t(t.f("text",c,p,0)));t.b("\n" + i);t.b("</section>");return t.fl(); },partials: {}, subs: {  }});
