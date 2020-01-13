$(document).ready(function () {
	
	//====================================================================================================
	//MENU
	let iconMenu = document.querySelector(".icon-menu");
	let body = document.querySelector("body");
	let menuBody = document.querySelector(".menu__body");

	iconMenu.addEventListener("click", function () {
		iconMenu.classList.toggle("active");
		body.classList.toggle("lock");
		menuBody.classList.toggle("active");
	});
	//====================================================================================================

	//====================================================================================================
	/* Добавление в разметку background-image инлайного. Класс .ibg */
	// /* Чистый JS */
	// function ibg() {
	// 	document.querySelectorAll(".ibg").forEach(el => {
	// 		if (el.querySelector('img')) {
	// 			el.style.backgroundImage = 'url(' + el.querySelector('img').getAttribute('src') + ')';
	// 		}
	// 	});
	// }
	// ibg();
	/* Добавление в разметку background-image инлайного. Класс .ibg */
	function ibg() {
		$.each($('.ibg'), function (index, val) {
			if ($(this).find('img').length > 0) {
				$(this).css('background-image', 'url("' + $(this).find('img').attr('src') + '")');
			}
		});
	}
	ibg();
	//====================================================================================================

	//====================================================================================================
	//SLIDERS
	if ($('.slider__body').length > 0) { //идет проверка, есть ли такой слайдер, если есть то включаем
		$('.slider__body').slick({
			//autoplay: true,
			//infinite: false,
			dots: true,
			arrows: false,
			accessibility: false,
			slidesToShow: 1,
			autoplaySpeed: 3000,
			adaptiveHeight: true,
			nextArrow: '<button type="button" class="slick-next"></button>',
			prevArrow: '<button type="button" class="slick-prev"></button>',
			responsive: [{
				breakpoint: 768,
				settings: {}
			}]
		});
	}
	//====================================================================================================
	
});