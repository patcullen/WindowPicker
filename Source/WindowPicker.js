/*
---
description: WindowPicker, WindowPicker.Transition.Line, WindowPicker.Transition.Carousel.

license: MIT-style

authors:
- Pat Cullen

requires:
- core/1.2.4: '*'

provides: [WindowPicker, WindowPicker.Transition.Line, WindowPicker.Transition.Carousel]

...
*/

var WindowPicker = new Class({
	Implements: [Options, Events],
	options: {
		target: null,
		transition: null,
		transitionOptions: {
			scale: 0.7,			// how much screen space should the total effect be scaled down by
			itemScale: 1,		// each item will be scaled by this
			itemOpacity: 1,		// each item opacicty will be multiplied by this, over and above effect opacity
			itemMaxWidth: 250,
			itemMaxHeight: 250,
			baseZIndex: 1000
		},
		instant: false,
		tweenOptions: {
			duration: 400
		},
		activeClass: 'windowPickerActive'
	},
	inMotion: false,
	position: 0,
	
	initialize: function(options) {
		this.setOptions(options);
		if (this.options.transition == null) this.options.transition = WindowPicker.Transition.Line;
		window.addEvent('keydown', this.catchGlobalKeyPress.bind(this));
		window.addEvent('keyup', this.catchGlobalKeyUp.bind(this));
		this.findWindows();
	},
	
	catchGlobalKeyUp: function(e) {
		if ((e.event.keyCode == 17) || (e.event.keyCode == 18)) {
			if (this.inMotion) {
				e.stopPropagation();
				this.close();
			}
		}
	},
	
	close: function() {
		this.inMotion = false;
		this.action('close');
		this.end();
	},
	
	catchGlobalKeyPress: function(e) {
		if (e.key == 'left' && (e.event.ctrlKey || e.event.altKey)) {
			e.stopPropagation();
			this.next();
		}
		if (e.key == 'right' && (e.event.ctrlKey || e.event.altKey)) {
			e.stopPropagation();
			this.previous();
		}
	},
	
	action: function(e) {
		this.fireEvent(e, [this]);
		if (this.position < 0) this.position += this.e.length;
		for (var i = 0; i < this.e.length; i++) {
			var j = (i + this.position) % this.e.length;
			var t = this.options.transition.value(j, this.e.length, this.e[i].retrieve('windowPicker.previousStyle'), this.options.transitionOptions);
			this.updateElement(this.e[i], t);
			if (j == 0) this.e[i].addClass(this.options.activeClass); else this.e[i].removeClass(this.options.activeClass);
		}
	},
	
	updateElement: function(e, t) {
		var newTransform = 'rotate('+t.r+'deg) scale('+t.s+') skew('+t.k[0]+'deg,'+t.k[1]+'deg)';
		var s = { 
			top: t.y+'px', 
			left: t.x+'px',
			zIndex: t.z,
			opacity: t.o,
			'-moz-transform': [e.retrieve('windowPicker.transform'), newTransform],
			'-webkit-transform': [e.retrieve('windowPicker.transform'), newTransform],
			'-o-transform': [e.retrieve('windowPicker.transform'), newTransform]
		};
		if (this.options.instant) 
			e.setStyles(s);
		else
			e.get('morph', this.tweenOptions).start(s);
		e.store('windowPicker.transform', newTransform);
	},
	
	findWindows: function() {
		this.e = [];
		if ($defined(this.options.target))
			$$(this.options.target).each(this.addWindow.bind(this));
	},
	
	next: function() {
		if (this.inMotion) this.position++; else {
			this.start();
			this.inMotion = true;
		}
		this.action('forward');	
	},
	
	previous: function() {
		if (this.inMotion) this.position--; else {
			this.start();
			this.inMotion = true;
		}
		this.action('back');
	},
	
	addWindow: function(e) {
		var f = $(e);
		this.e.push(f);
		this.fireEvent('add', [this]);
	},
	
	rememberElementStyle: function(e) {
		var fc = e.getCoordinates(e.getParent());
		e.store('windowPicker.previousStyle', {
			top: fc.top,
			left: fc.left,
			width: fc.width,
			height: fc.height,
			opacity: e.getStyle('opacity'),
			zIndex: e.getStyle('z-index'),
			MozTransformOrigin: e.getStyle('-moz-transform-origin'),
			WebkitTransformOrigin: e.getStyle('-webkit-transform-origin'),
			OTransformOrigin: e.getStyle('-o-transform-origin')
		});
		e.store('windowPicker.transform', 'rotate(0deg) scale(1) skew(0deg,0deg)');
		e.setStyles({
			'-moz-transform-origin': 'left top',
			'-webkit-transform-origin': 'left top',
			'-o-transform-origin': 'left top'
		});
	},
	
	start: function() {
		this.findWindows();
		this.e.each(this.rememberElementStyle);
	},
	
	end: function() {
		for (var i = 0; i < this.e.length; i++) {
			var t = this.e[i].retrieve('windowPicker.previousStyle');
			this.updateElement(this.e[i], {
				x: t.left,
				y: t.top,
				o: 1, s: 1, r: 0, k: [0, 0]
			});
			this.e[i].removeClass(this.options.activeClass);
		}
		this.fireEvent('close', [this, this.e[this.position % this.e.length]]);
	}

});

WindowPicker.extend({
	
	Transition: { // { x, y, z, o, s, r, k } :: {x, y, zIndex, opacity, scale, rotation, skew[x,y] }
	
		Line: {
			options: {
				frontOpacity: 1,
				backOpacity: 0.1,
				backScale: 0.2
			},
			value: function(i, l, e, o) { // return an object: { x, y, z, o, s, r }
				// inverted counter
				var j = l-1-i;
				// % position in stack
				var r = ((j+1)/l)
				// setup options
				var p = $merge(WindowPicker.Transition.Line.options, o);
				var w = window.getCoordinates();
				var a = (2*Math.PI)/l;
				// scaling
				var scale = (p.scale - p.backScale)*r + p.backScale;
				var t = {
					x: ((w.width / 2) ) + (Math.cos(i*a/5+90)*p.itemMaxWidth),
					y: ((w.height / 2)) + (p.itemMaxHeight/2) + (Math.cos(i*a/5+160)*p.itemMaxWidth),
					z: p.baseZIndex + j,
					o: p.itemOpacity * ((p.frontOpacity-p.backOpacity)*r+p.backOpacity),
					s: 1, r: 0, k: [0, -10*i/l]
				};
				// check scaling makes items small enough
				if (e.width * t.s > p.itemMaxWidth) t.s *= p.itemMaxWidth / e.width;
				if (e.height * t.s > p.itemMaxHeight) t.s *= p.itemMaxHeight / e.height;
				// % position scaling in the stack
				t.s = t.s * (((j/l)*(1-p.backScale))+p.backScale);
				// check opacity
				if (t.o < 0) t.o = 0; if (t.o > 1) t.o = 1;
				return t;
			}
		},
	
		Carousel: {
			options: {
				frontOpacity: 1,
				backOpacity: 0.2
			},
			value: function(i, l, e, o) { // return an object: { x, y, z, o, s, r }
				// setup options
				var j = l-1-i;
				var p = $merge(WindowPicker.Transition.Carousel.options, o);
				var w = window.getCoordinates();
				// angle step
				var a = (2*Math.PI)/l;
				// the y coordinate relative to center of effect
				var yc = (Math.cos(i*a)*p.itemMaxHeight/2);
				var t = {
					x: (w.width/2) - (Math.sin(i*a)*p.itemMaxWidth) - p.itemMaxWidth,
					y: (w.height/2) + yc - p.itemMaxHeight*1.3,
					o: ((p.frontOpacity-p.backOpacity)*(((yc*2)/p.itemMaxHeight)/2+0.5))+p.backOpacity,
					s: p.itemScale,
					r: 0, k: [0, 0]
				};
				// set z index relative to y position
				t.z = p.baseZIndex + t.y;
				// check width and height
				if (e.width * t.s > p.itemMaxWidth) t.s *= p.itemMaxWidth / e.width;
				if (e.height * t.s > p.itemMaxHeight) t.s *= p.itemMaxHeight / e.height;
				// check valid opacity
				if (t.o < 0) t.o = 0; if (t.o > 1) t.o = 1;
				// center the items
				t.x += p.itemMaxWidth - (e.width*t.s)/2;
				t.y += p.itemMaxHeight - (e.height*t.s)/2;
				return t;
			}
		}
	
	}

});