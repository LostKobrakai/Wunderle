!function($,n){var t=function(n,t,i){var r;return function e(){function e(){i||n.apply(u,a),r=null}var u=this,a=arguments;r?clearTimeout(r):i&&n.apply(u,a),r=setTimeout(e,t||100)}};$.fn[n]=function(i){return i?this.bind("resize",t(i)):this.trigger(n)}}($,"smartresize");