document.addEventListener("DOMContentLoaded", () => {
    const scrolling = (upSelector) => {
        const upElem = document.querySelector(upSelector);
    
        window.addEventListener('scroll', () => {
            if (document.documentElement.scrollTop > 550) {
                upElem.classList.add('animated', 'fadeIn');
                upElem.classList.remove('fadeOut');
            } else {
                upElem.classList.add('fadeOut');
                upElem.classList.remove('fadeIn');
            }
        });
    
        let links = document.querySelectorAll('[href^="#"]'),
            speed = 0.3;
        
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
    
                let widthTop = document.documentElement.scrollTop,
                    hash = this.hash,
                    toBlock = document.querySelector(hash).getBoundingClientRect().top,
                    start = null;
    
                requestAnimationFrame(step);
    
                function step(time) {
                    if (start === null) {
                        start = time;
                    }
    
                    let progress = time - start,
                        r = (toBlock < 0 ? Math.max(widthTop - progress/speed, widthTop + toBlock) : Math.min(widthTop + progress/speed, widthTop + toBlock));
    
                        document.documentElement.scrollTo(0, r);
    
                    if (r != widthTop + toBlock) {
                        requestAnimationFrame(step);
                    } else {
                        location.hash = hash;
                    }
                }
            });
        });
    }
    
    const burger = (burgerSelector, burgerElementsSelector, menuSelector, menuLinkSelector) => {
    
        const burgerBtn = document.querySelector(burgerSelector);
        const burgerElements = document.querySelectorAll(burgerElementsSelector);
        const menuElement = document.querySelector(menuSelector);
        const menuElements = document.querySelectorAll(menuLinkSelector);
        const bodyElement = document.querySelector('body');
        let styleTop = getComputedStyle(menuElement).top.slice(0, -2);
        const screenHeight = (document.documentElement.clientHeight - styleTop) + 'px';
     
        menuElement.style.height = screenHeight;
        const toggleClasses = () => {
            menuElement.classList.toggle('burger__menu--active');
            bodyElement.classList.toggle('noscroll');
            burgerElements.forEach( (item) => {
                item.classList.toggle('burger-elem--transformed')
            })
        }
    
        burgerBtn.addEventListener('click', () => toggleClasses());
        menuElements.forEach( (item) => {
            item.addEventListener('click', () => toggleClasses())
        })
    }
    
    const openPopup = (btnSelector, overlaySelector, popupSelector, closeSelector, phoneInputSelector, nameInputSelector, telegramInputSelector, thanksPopupSelector, errorPopupSelector) => {
        const bodyElement = document.querySelector('body');
        const triggerBtn = document.querySelector(btnSelector);
        const overlay = document.querySelector(overlaySelector);
        const popupWindow = document.querySelector(popupSelector);
        const closeBtn = document.querySelector(closeSelector);
        const thanksPopup = document.querySelector(thanksPopupSelector);
        const errorPopup = document.querySelector(errorPopupSelector);

        const sendBtn = document.querySelector('.popup__form-btn');

        phoneNumMask(phoneInputSelector);
        checkNameInputs(nameInputSelector);
        checkTelegramInputs(telegramInputSelector);

        triggerBtn.addEventListener('click', () => {
            bodyElement.classList.add('noscroll');
            overlay.style.display = 'block';
            popupWindow.style.display = 'block';
            closeBtn.addEventListener('click', () => {
                closePopup(popupWindow)
            });
            overlay.addEventListener('click', (event) => {
                if (event.target == overlay) {
                    closePopup(popupWindow);
                }
            });
        })

        const closePopup = (popupElem) => {
            bodyElement.classList.remove('noscroll');
            overlay.style.display = 'none';
            popupElem.style.display = 'none';
        }

        const showThanksPopup = (popup, popupWindow) => {
            popupWindow.style.display = 'none';
            popup.style.display = 'block';
            setTimeout(() => {
                closePopup(thanksPopup)
            }, 5000)
        }

        const showErrorPopup = (popup, popupWindow) => {
            popupWindow.style.display = 'none';
            popup.style.display = 'block';
            setTimeout(() => {
                closePopup(popup)
            }, 5000)
        }

        sendBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const result = await fetch('/handleForm?' + new URLSearchParams({
                    name: document.querySelector(nameInputSelector).value,
                    phone: document.querySelector(phoneInputSelector).value,
                    telegram: document.querySelector(telegramInputSelector).value
                }))
                result.status === 200 ? showThanksPopup(thanksPopup, popupWindow) : showErrorPopup(errorPopup, popupWindow);
            } catch (error) {
                showErrorPopup(errorPopup, popupWindow);
            }
        })

        function phoneNumMask(selector) {
            let setCursorPosition = (pos, elem) => {
                elem.focus();
            
                if (elem.setSelectionRange) {
                  elem.setSelectionRange(pos, pos);
                } else if (elem.createTextRange){
                  let range = elem.createTextRange();
            
                  range.collapse(true);
                  range.moveStart('character', pos);
                  range.moveEnd('character', pos);
                  range.select();
                }
              };
            
              function createMask(event) {
                let matrix = '+38 (0__) ___ __ __';
                let i = 0;
                let def = matrix.replace(/\D/g, '');
                let val = this.value.replace(/\D/g, '');
            
                if (def.length >= val.length) {
                  val = def;
                }
            
                this.value = matrix.replace(/./g, function (a) {
                  return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
                });
            
                if (event.type === 'blur') {
                  if (this.value.length == 2) {
                    this.value = '';
                  }
                } else {
                  setCursorPosition(this.value.length, this);
                }
              }
            
              let input = document.querySelector(selector);
            
                input.addEventListener('input', createMask);
                input.addEventListener('keypress', createMask);
                input.addEventListener('focus', createMask);
                input.addEventListener('blur', createMask);
        }
        function checkNameInputs(selector) {
            const txtInputs = document.querySelectorAll(selector);
            txtInputs.forEach(input => {
                input.addEventListener('input', function () {
                  input.value = input.value.replace(/[^а-яёіїы ]/ig, '');
                })
              });
        }
        function checkTelegramInputs(selector) {
            const txtInputs = document.querySelectorAll(selector);
            txtInputs.forEach(input => {
                input.addEventListener('input', function () {
                  input.value = input.value.replace(/[а-яёіїы]/ig, '');
                })
              });
        }
    }



    scrolling('.pageup-arrow');
    burger('.burger', '.burger-elem', '.header__menu-mobile', '.header__menu-link');
    openPopup('[data-openForm]', '.overlay', '#registration', '.popup__close', '[name="phone"]', '[name="name"]', '[name="telegram"]', '#thanks', '#error');
})