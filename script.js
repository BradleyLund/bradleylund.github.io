$(function() {
	
	var container = $('.gradients');

	function fade() {

		var divs = container.children();
		for (let i=0;i<divs.length;i++) {
			if (divs[i].id=="everything") {
				divs.splice(i,1)
			}
		}
		
		$(".current").transition({opacity: 1}, 2000, 'linear', function() {
			$('.current').removeClass('current');
			firstDiv = divs.first();
			firstDiv.addClass('current').css({opacity: 0});
			firstDiv.appendTo(container);
			fade();
		});
	}

	fade();

});