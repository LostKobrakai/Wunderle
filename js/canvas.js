var canvas = {
	init: function(){
		var ele;

		ele = document.querySelector(".canvas");
		if(ele){
			this.play(ele);
		}
	},

	play: function(ele){
		function lerp(x, a, b){
			return (1 - x) * a + x * b;
		}

		function dist(x, y, x0, y0){
			return Math.sqrt((x -= x0) * x + (y -= y0) * y);
		}

		var params, two, canvas, rectangles, center, edge, maxDist, Two = window.Two || null;

		// Make an instance of two and place it on the page.
		params = { width: 1100, height: 300, steps: 100, type: Two.Types.canvas };
		two = new Two(params).appendTo(ele);
		canvas = document.querySelector("canvas");
		rectangles = [];
		canvas.style.marginRight = "auto";
		canvas.style.marginLeft = "auto";
		canvas.style.marginTop = "10px";


		center = {x: params.width/2, y: params.height/2};
		edge = {x: 0, y: 0};
		maxDist = dist(edge.x, edge.y, center.x, center.y);
		for(var w = 0; w < params.width/params.steps; w++){
			for(var h = 0; h < params.height/params.steps; h++){
				var rect, pivot, curDist, c;
				rect = two.makeRectangle((w + 0.5)*params.steps, (h + 0.5)* params.steps, params.steps, params.steps);
				
				pivot = {x: (w + 0.5)*params.steps, y: (h + 0.5)*params.steps};
				
				curDist = dist(pivot.x, pivot.y, center.x, center.y);
				c = Math.floor(lerp((curDist/maxDist), 250, 190));
				rect.fill = 'rgb('+c+', '+c+', '+c+')';
				rect.baseColor = c;
				rect.noStroke();
				
				rectangles.push(rect);
			}
		}

		two.update();

		var mouse = {x: -200, y: -200};
		two.renderer.domElement.addEventListener('mousemove', function(e) {
			var rect = this.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		}, false);

		two.renderer.domElement.addEventListener('mouseleave', function() {
			mouse.x = -200;
			mouse.y = -200;
		}, false);

		two.bind('update', function() {
			for (var i = 0; i < rectangles.length; i++) {
				var rect, c, curDist;

				rect = rectangles[i];
				c = 0;
				curDist = dist(mouse.x, mouse.y, rect.translation.x, rect.translation.y);

				if(curDist < 200){
					c = rect.baseColor;
					c += Math.floor(lerp((curDist/200), 30, 10));
					if(c > 255){
						c = 255;
					}
					rect.fill = 'rgb('+c+', '+c+', '+c+')';
				}else{
					c = rect.baseColor;
					rect.fill = 'rgb('+c+', '+c+', '+c+')';
				}
			}
		});

		//two.update();
		two.play();
	}
};

canvas.init();