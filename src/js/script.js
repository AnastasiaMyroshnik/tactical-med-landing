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
    
    scrolling('.pageup-arrow');
    burger('.burger', '.burger-elem', '.header__menu-mobile', '.header__menu-link');
})