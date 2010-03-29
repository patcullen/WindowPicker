WindowPicker
===========

WindowPicker is a class designed to facilitate the user visually scrolling through elements. 

If an image is found within the description, that becomes the screenshot of the plugin. Screenshots are optional but encouraged, given the plugin has some visual interaction. The screenshot can be of any size, but try to keep it of about 200x100.

![Screenshot](http://pat.cullen.co.za/project/WindowPicker/Screenshot200x100.png)

How to use
----------

To make a WindowPicker that automatically targets a certain class of elements you can initialize it like this:

	var picker = new WindowPicker({
		target: '.window'
	});

From here, The window picker will automatically react to CTRL-Left and CTRL-Right keypresses. Everytime the effect is restarted the WindowPicker will rescan the page for elements that match your target class.

To spin your elements in a circle/carousel, use the transition option set as follows:
	var picker = new WindowPicker({
		target: '.window',
		transition: WindowPicker.Transition.Carousel
	});


The WindowPicker can be run in a more manual way. To do this you must leave the target option as null (default). Please check the class source to see the full list of methods available; but you will probably find the following methods particuarly usefull: addWindow(), next(), previous(), close().

Screenshots
-----------

This section is optional, but encouraged if the plugin affords it. Just a list of images, one per line. We do the resizing, so use actual size screenshots.

![Screenshot](http://pat.cullen.co.za/project/WindowPicker/Screenshot400x200.png)


Known Bugs and Quirks
---------------------

The Transition functions could use a bit of work. Caching and any kind of optimizing are missing. I've also noticed the items dont scale in a way I'd call predicatable. But it looks OK for first release and didn't want to delay.

