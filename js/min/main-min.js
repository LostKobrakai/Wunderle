function requireTemplateJavascript(){require(["libs/hogan.min","templates"],function(e){console.log(e)})}Modernizr.history&&(document.getElementsByTagName("html")[0].className.match(/ie/)?require(["libs/jquery.min"],function(){requireTemplateJavascript(),console.log($)}):require(["libs/zepto.min"],function(){requireTemplateJavascript()}));