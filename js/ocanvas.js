var console = console || null;

var canvas = {
	canvas: undefined,
	gridSize: 120,
	rectangles: [],
	redrawGrid: false,

	color: {
		center: 255,
		outerEdge: 190
	},

	init: function(w, h){
		var oCanvas = window.oCanvas || null;

		this.canvas = oCanvas.create({
			canvas: "#homeCanvas",
			background: "#000",
			fps: 30
		});

		this.canvas.width = w * this.gridSize;
		this.canvas.height = h * this.gridSize;

		this.layoutGrid();
		this.colorGrid();

		this.canvas.setLoop(this.mouseLight);
		this.canvas.timeline.start();
	},

	layoutGrid: function(){
		for(var h = 0; h < this.canvas.width/this.gridSize; h++){
			for(var v = 0; v < this.canvas.height/this.gridSize; v++){
				var rect = this.canvas.display.rectangle({
					x: h * this.gridSize,
					y: v * this.gridSize,
					width: this.gridSize,
					height: this.gridSize,
					fill: "#fff"
				});

				this.canvas.addChild(rect);
				this.rectangles.push(rect);
			}
		}
	},

	colorGrid: function(){
		var x1 = this.canvas.width/2,
				y1 = this.canvas.height/2,
				maxDist = this.helper.dist(x1, y1, 0, 0);

		for (var i = this.rectangles.length - 1; i >= 0; i--) {
			var dist, x2, y2, color, rect;

			rect = this.rectangles[i];

			x2 = rect.x + (rect.width / 2);
			y2 = rect.y + (rect.height / 2);
			dist = this.helper.dist(x1, y1, x2, y2);
			color = Math.floor(this.helper.lerp(dist/maxDist, this.color.center, this.color.outerEdge));

			rect.fill = "rgb("+color+", "+color+", "+color+")";
		}

		this.canvas.redraw();
	},

	mouseLight: function(){
		console.log(canvas.canvas.mouse.onCanvas());
		if(canvas.canvas.mouse.onCanvas()){
			var x1 = canvas.canvas.mouse.x,
					y1 = canvas.canvas.mouse.y;

			canvas.colorGrid();

			for (var i = canvas.rectangles.length - 1; i >= 0; i--) {
				var dist, x2, y2, rect;

				rect = canvas.rectangles[i];

				x2 = rect.x + (rect.width / 2);
				y2 = rect.y + (rect.height / 2);
				dist = canvas.helper.dist(x1, y1, x2, y2);

				if(dist < 100){
					rect.fill = "rgb(100,100,100)";

					if(!canvas.redrawGrid){
						canvas.redrawGrid = true;
					}
				}
			}

			canvas.canvas.redraw();
		}else if(canvas.redrawGrid){
			canvas.colorGrid();
			canvas.redrawGrid = false;
		}
	},

	helper: {
		lerp: function(r, a, b){
			return (1 - r) * a + r * b;
		},

		dist: function(x1, y1, x2, y2){
			return Math.sqrt((x1 -= x2) * x1 + (y1 -= y2) * y1);
		}
	}
};

canvas.init(9, 3);