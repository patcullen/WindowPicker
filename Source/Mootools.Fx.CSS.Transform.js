/*
---
description: Fx.CSS.Parsers.Transform*, extensions to Fx.CSS.Parsers to accomodate CSS3 Transform rules for Rotate, Scale and Skew.

license: MIT-style

authors:
- Pat Cullen

requires:
- core/1.2.4: '*'

provides: [Fx.CSS.Parsers.TransformRotate, Fx.CSS.Parsers.TransformScale, Fx.CSS.Parsers.TransformSkew]

*/

Element.Styles.MozTransform = "rotate(@deg) scale(@) skew(@deg,@deg)"; 
Element.Styles.OTransform = "rotate(@deg) scale(@) skew(@deg,@deg)"; 
Element.Styles.WebkitTransform = "rotate(@deg) scale(@) skew(@deg,@deg)"; 

Fx.CSS.Parsers.extend({

	TransformRotate: {
		parse: function(value){
			return ((value = value.match(/^rotate\(([-+]?([0-9]*\.)?[0-9]+)deg\)$/i))) ? parseFloat(value[1]) : false;
		},
		compute: function(from, to, delta){
			return Fx.compute(from, to, delta);
		},
		serve: function(value){
			return 'rotate('+value+'deg)';
		}
	},

	TransformScale: {
		parse: function(value){
			return ((value = value.match(/^scale\((([0-9]*\.)?[0-9]+)\)$/i))) ? parseFloat(value[1]) : false;
		},
		compute: function(from, to, delta){
			return Fx.compute(from, to, delta);
		},
		serve: function(value){
			return 'scale('+value+')';
		}
	},

	TransformSkew: {
		parse: function(value){
			return ((value = value.match(/^skew\(([-+]?([0-9]*\.)?[0-9]+)deg,([-+]?([0-9]*\.)?[0-9]+)deg\)$/i))) ? [parseFloat(value[1]),parseFloat(value[3])] : false;
		},
		compute: function(from, to, delta){
			return from.map(function(value, i){
				return Fx.compute(from[i], to[i], delta);
			});
		},
		serve: function(value){
			return 'skew('+value[0]+'deg,'+value[1]+'deg)';
		}
	}

});

