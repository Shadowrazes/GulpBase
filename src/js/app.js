import BurgerMenu from './BurgerMenu.js';

const isMobile = document.documentElement.clientWidth <= 768;
const isTablet = document.documentElement.clientWidth <= 1100;
const isLaptop = document.documentElement.clientWidth <= 1440;
const isDesktop = document.documentElement.clientWidth > 1440;

function isWebp() {
    // Проверка поддержки webp
    const testWebp = (callback) => {
        const webP = new Image();

        webP.onload = webP.onerror = () => callback(webP.height === 2);
        webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    // Добавление класса _webp или _no-webp для HTML
    testWebp((support) => {
        const className = support ? 'webp' : 'no-webp';
        document.querySelector('html').classList.add(className);
        console.log(support ? 'webp поддерживается' : 'webp не поддерживается');
    });
}

isWebp();

const InsertPostContents = () => {
	const headers = [];
	const indexes = [0];
	const articleContent = document.querySelector('.post__content');
	// функция для получения предыдущего header
	const getPrevHeader = (diff = 0) => {
	  if ((indexes.length - diff) === 0) {
		return null;
	  }
	  let header = headers[indexes[0]];
	  for (let i = 1, length = indexes.length - diff; i < length; i++) {
		header = header.contains[indexes[i]];
	  }
	  return header;
	}
	// функция для добавления item в headers
	const addItemToHeaders = (el, diff) => {
	  let header = headers;
	  if (diff === 0) {
		header = indexes.length > 1 ? getPrevHeader(1).contains : header;
		indexes.length > 1 ? indexes[indexes.length - 1]++ : indexes[0]++;
	  } else if (diff > 0) {
		header = getPrevHeader().contains;
		indexes.push(0);
	  } else if (diff < 0) {
		const parentHeader = getPrevHeader(Math.abs(diff) + 1);
		for (let i = 0; i < Math.abs(diff); i++) {
		  indexes.pop();
		}
		header = parentHeader ? parentHeader.contains : header;
		parentHeader ? indexes[indexes.length - 1]++ : indexes[0]++;
	  }
	  header.push({ el, contains: [] });
	}
	// сформируем оглавление страницы для вставки его на страницу
	let html = '';
	const createTableOfContents = (items) => {
	  html += '<ol>';
	  for (let i = 0, length = items.length; i < length; i++) {
		const url = `${location.href.split('#')[0]}#${items[i].el.id}`;
		html += `<li><a href="${url}">${items[i].el.textContent}</a>`;
		if (items[i].contains.length) {
		  createTableOfContents(items[i].contains);
		}
		html += '</li>';
	  }
	  html += '</ol>';
	}

	if(articleContent){
	  const contentsList = document.querySelector('.post__contents-list');
	  if(contentsList){
		// добавим заголовки в headers
		articleContent.querySelectorAll('h2, h3, h4').forEach((el, index) => {
			if (!el.id) {
			el.id = `id-${index}`;
			}
			if (!index) {
			addItemToHeaders(el);
			return;
			}
			const diff = el.tagName.substring(1) - getPrevHeader().el.tagName.substring(1);
			addItemToHeaders(el, diff);
		});

		createTableOfContents(headers);
		contentsList.insertAdjacentHTML('afterbegin', html);
	  }
	}
}

function CallbackFormInit(){
    let forms = document.querySelectorAll('form');

    if(forms.length > 0){
        forms.forEach((form) =>{
            let phoneInputs = form.querySelectorAll('input[name="phone"]');

            if(phoneInputs.length > 0) {
                phoneInputs.forEach((phoneInput) => {
                    const phoneMask = new IMask(phoneInput, {
                        mask: "+{7} (000) 000-00-00",
                    });

                    phoneInput.addEventListener('input', (event) => {
                        event.preventDefault();
                
                        if (!phoneMask.masked.isComplete) {
                            phoneInput.classList.add("uk-form-danger");
                        } 
                        else {
                            phoneInput.classList.remove("uk-form-danger");
                        }
                    });

                    form.addEventListener('submit', (event) => {
                        event.preventDefault();
                
                        if (!phoneMask.masked.isComplete){
                            return;
                        }
						
						let formData = {};
						let inputs = form.querySelectorAll('input:not([type="submit"]), textarea');
						if(inputs.length > 0) {
							inputs.forEach((input) => {
								formData[input.getAttribute('name')] = input.value;
							})
						}

						jQuery.ajax({
							url: '/wp-admin/admin-ajax.php',
							method: 'post',
							data: {
								action: 'sendForm',
								data: JSON.stringify(formData)
							},
							success: function(data){
								let successPopupNode = document.querySelector('#success-popup');
								UIkit.modal(successPopupNode).show();
							}
						});
                    })
                })
            }
        })
    };
}

function LoadMapOnScroll(){
    let isMapAppend = false;
	let mapNode = document.querySelector('.map');
	if(mapNode) {
		document.addEventListener('scroll', (event) => {
			if(!isMapAppend) {
				if(window.scrollY > 1000) {
					let script = document.createElement('script');
					
					script.src = 'https://nalogsib.ru/wp-content/themes/NalogSib/js/map.js';
					script.type = 'text/javascript';
					
					mapNode.append(script);
					isMapAppend = true;
				}
			}
		});
	}
}

function InitTripleColumnSlider(){
    const TripleColumnSlider = document.querySelector('.alt-slider__slider');
    if(TripleColumnSlider) {
        UIkit.slider(TripleColumnSlider, {
            center: true
        });
        let lastSlide = document.querySelector('.alt-slide_center');
        UIkit.util.on(TripleColumnSlider, 'itemshown', (event) => {
            lastSlide.classList.remove('alt-slide_center');
            event.target.classList.add('alt-slide_center');
            lastSlide = event.target;
        })
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    CallbackFormInit();
    InitTripleColumnSlider();

    particlesJS.load('particles-slider', 'static/ParticlesJSON/GreenHexagons.json');

    // Содержание статьи по заголовкам
    // InsertPostContents();

    // Прогрузка карты при скролле
    // LoadMapOnScroll()

    if(isTablet) {
        const burgerNode = document.querySelector('.burger');
        new BurgerMenu(burgerNode);
    }
})