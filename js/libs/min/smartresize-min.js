!function($,t){var n=function(t,n,e){var i;return function r(){function r(){e||t.apply(u,o),i=null}var u=this,o=arguments;i?clearTimeout(i):e&&t.apply(u,o),i=setTimeout(r,n||100)}};Zepto.fn[t]=function(e){return e?this.bind("resize",n(e)):this.trigger(t)}}(Zepto,"smartresize");