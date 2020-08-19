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

	

	// var container2 = $('.headings');
	// console.log(container2)


	// function fadeText() {

	// 	var headings = container2.children();
	// 	console.log(headings)

	// 	$(".current").transition({opacity: 1}, 2000, 'linear', function() {
	// 		$('.current').removeClass('current');
	// 		firstDiv = headings.first();
	// 		firstDiv.addClass('current').css({opacity: 0});
	// 		firstDiv.appendTo(container2);
	// 		fadeText();
	// 	});
	// }
	fade();
	// fadeText();

});