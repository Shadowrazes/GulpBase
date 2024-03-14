const isMobile = document.documentElement.clientWidth <= 640;
const isTablet = document.documentElement.clientWidth <= 1200;
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

async function CallbackFormInit(){
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

                        let successPopupNode = document.querySelector('#callback-popup-success');
                        // Удалить в проде
						UIkit.modal(successPopupNode).show();
                        //  //

						// jQuery.ajax({
						// 	url: '/wp-admin/admin-ajax.php',
						// 	method: 'post',
						// 	data: {
						// 		action: 'sendForm',
						// 		data: JSON.stringify(formData)
						// 	},
						// 	success: function(data){
						// 		UIkit.modal(successPopupNode).show();
						// 	}
						// });
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

async function InitCenteredSliders() {
    let centeredSliders = document.querySelectorAll('.slider_centered');
    if (centeredSliders.length > 0) {
        centeredSliders.forEach((centeredSlider) => {
            let lastSlide = document.querySelector('.slider_centered__item_center');
            UIkit.util.on(centeredSlider, 'itemshown', (event) => {
                lastSlide.classList.remove('slider_centered__item_center');
                event.target.classList.add('slider_centered__item_center');
                lastSlide = event.target;
            });
        });
    };
}

async function EnableSubmitOnCheckbox(){
	let checks = document.querySelectorAll('.form-checkbox');
	checks.forEach((checkbox) =>{
		let form = checkbox.closest('form');
		let button = form.querySelector('button[type="submit"]');
		if (form && button)
		{
			button.classList.toggle('btn_inactive');
			checkbox.addEventListener('click', (event) => {
				button.classList.toggle('btn_inactive');
			});
		}
	});
}

function InitBurgerMenu() {
    const burgerNode = document.querySelector('.header__burger-btn');
    if (burgerNode) {
        UIkit.modal(document.querySelector('.header__burger-menu'));
        burgerNode.addEventListener('click', (event) => {
            burgerNode.classList.toggle('header__burger-btn_active');
        });
    }
}

function InitCityPopup() {
    if (document.cookie.includes("selectedCity")) {
        return;
    }

    const cityPopupNode = document.querySelector("#city-popup");

    if(cityPopupNode){
        const acceptBtn = document.querySelector(".city-popup__accept-btn");
        const cityPopup = UIkit.modal(cityPopupNode);
    
        cityPopup.show();
    
        if(acceptBtn){
            acceptBtn.addEventListener('click', (event) => {
                let domainSplit = window.location.host.split('.');
                let subDomain = domainSplit.length > 2 ? window.location.host.split('.')[0] : 'новосибирск';
    
                document.cookie = `selectedCity=${subDomain}; path=/; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}`;
            });
        }
    }
}

function InitCookieAgree() {
	if (document.cookie.includes("cookieAgree")) {
        return;
    }
	
	const cookieNoteNode = document.querySelector("#cookie-note");
	if(cookieNoteNode){
		const acceptBtn = cookieNoteNode.querySelector(".cookie-note__accept-btn");

		if(acceptBtn){
			cookieNoteNode.style.display = "block";
			acceptBtn.addEventListener('click', (event) => {
				document.cookie = `cookieAgree=true; path=/; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}`;
				cookieNoteNode.style.display = "none";
			});
		}
	}
}

async function InitLoadMorePosts() {
    const moreBtn = document.querySelector('.blog__articles-more-btn');
    if (moreBtn) {
        jQuery(function ($) {
            $(".blog__articles-more-btn").on("click", function () {
                const button = $(this);
                button.html("Загрузка...");

                const data = {
                    "action": "load_more",
                    "page": currentPage
                }

                $.ajax({
                    url: "/wp-admin/admin-ajax.php",
                    data: data,
                    type: "POST",
                    success: function (data) {
                        if (data) {
                            button.html("Загрузить ещё");
                            button.prev().prev().append(data);
                            currentPage++;
                            if (currentPage == maxPages) {
                                button.remove();
                            }
                        } else {
                            button.remove();
                        }
                    }
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    // ASYNC
    InitCenteredSliders();      // Преключение класса центрального слайда при свайпах
    CallbackFormInit();         // Инцициализация всех форм (Маска тел. + ajax на submit)
    EnableSubmitOnCheckbox();   // Активация submit только после согласия с политикой
    // InitLoadMorePosts();        // Инит кнопки "Загрузить еще" для постов, см. WP ExBlog.php, functions.php
    // END ASYNC

    InitCityPopup();
	InitCookieAgree();

    // InsertPostContents();    // Содержание статьи по заголовкам
    // LoadMapOnScroll();       // Прогрузка карты при скролле

    if(isTablet) {
        InitBurgerMenu();
    }

    // Наложение партикла
    // particlesJS.load('particles-slider', 'static/ParticlesJSON/GreenHexagons.json');
})