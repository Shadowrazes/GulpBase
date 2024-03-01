// <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>

ymaps.ready(init);

function init () {
    var myMap = new ymaps.Map('map', {
            center: [55.04905428404396,82.91814899209585],
			zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        }),
        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="margin: 10px;">' +
                '<span id="counter-button"> {{properties.address}} </span>' +
            '</div>', {

            build: function () {
                BalloonContentLayout.superclass.build.call(this);
            },

            clear: function () {
                BalloonContentLayout.superclass.clear.call(this);
            },
        });
	
	myMap.events.add('click', function() {
		myMap.balloon.close();
	});

    myPlacemark = new ymaps.Placemark(
		[55.057187569644995,82.91383599999993],{
            address: 'ул. Красный проспект, д. 1'
        },
		{
			balloonContentLayout: BalloonContentLayout,
			balloonOffset: [0, 0],
			balloonShadow: false,
			balloonPanelMaxMapArea: 0,
			iconLayout: 'default#image',
			iconImageHref: '/map-pin.png',
			iconImageSize: [81, 115],
			iconImageOffset: [-40, -90],
			hideIconOnBalloonOpen: false,
			balloonCloseButton: false,
		}
	)

	myPlacemark2 = new ymaps.Placemark(
		[55.04183856966463,82.93006849999993],{
            address: 'ул. Семьи Шамшиных'
        },
		{
			balloonContentLayout: BalloonContentLayout,
			balloonOffset: [0, 0],
			balloonShadow: false,
			balloonPanelMaxMapArea: 0,
			iconLayout: 'default#image',
			iconImageHref: '/map-pin.png',
			iconImageSize: [81, 115],
			iconImageOffset: [-40, -90],
			hideIconOnBalloonOpen: false,
			balloonCloseButton: false,
		}
	)

	myMap.geoObjects.add(myPlacemark);
	myMap.geoObjects.add(myPlacemark2);
}