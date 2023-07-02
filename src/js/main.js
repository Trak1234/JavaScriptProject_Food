document.addEventListener("DOMContentLoaded", () => {
  // tabs
  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function HideTabsContent() {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });
  }

  tabs.forEach((tab) => {
    tab.classList.remove("tabheader__item_active");
  });

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }
  HideTabsContent();

  showTabContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;

    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          HideTabsContent();
          showTabContent(i);
        }
      });
    }
  });
  //Timer

  const deadline = "2023-07-10";

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const t = Date.parse(endtime) - Date.parse(new Date());

    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      (days = Math.floor(t / (1000 * 60 * 60 * 24))),
        (hours = Math.floor((t / (1000 * 60 * 60)) % 24)),
        (minutes = Math.floor((t / (1000 / 60)) % 60)),
        (seconds = Math.floor((t / 1000) % 60));
    }

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num > 0 && num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();
    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadline);

  //modal_window

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    modalCloseBtn = document.querySelector("[data-close]");

  console.log(modalTrigger);

  function openModal() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    clearInterval(modalTimer);
  }

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  modalCloseBtn.addEventListener("click", closeModal);

  modal.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      closeModal();
    }
  });

/*   const modalTimer = setTimeout(openModal, 5000); */

  
  function showModalByScroll(){ 
    if(window.documentElement.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1){
        openModal();
        window.removeEventListener('scroll', showModalByScroll);

    }
  }

  window.addEventListener('scroll', showModalByScroll );

  // menu Card classes

  class MenuCard {
    constructor(src,alt, title,descr,price, parentSelector, ...classes){
        this.src = src;
        this.alt = alt;
        this.classes = classes;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.transfer = 27;
        this.parent = document.querySelector(parentSelector);
        
    }

    changeToUAH() {
        this.price = this.price * this.transfer;
    }


    render(){
        const element = document.createElement('div');
        this.classes.forEach(className => element.classList.add(className));
        element.innerHTML= `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
    `;
        this.parent.append(element);
        
    }
  }

  new MenuCard(
    "img/tabs/vegy.jpg",
    "elite",
    `Меню “Премиум”`,
    `В меню “Премиум” мы используем не только красивый дизайн упаковки, но
    и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода
    в ресторан!`,
    9,
    ".menu .container",
    "menu__item",
    "big"

  ).render();


  //form

  const forms = document.querySelectorAll('form');

  const messages = {
    loading: 'Загрузка',
    seccess: 'Спасибо! Скоро мы с вами свяжемся',
    failuer: 'Что-то пошло не так...'
};
  
  forms.forEach(item => {
    formData(item);
  });

  function formData(form){
    form.addEventListener('submit', (e)=> {
        e.preventDefault();

        const statusMessages = document.createElement('div');
              statusMessages.classList.add('status');
              statusMessages.textContent = messages.loading;
              form.appendChild(statusMessages);

        const request = new XMLHttpRequest;

        request.open('POST', 'server.php');

        request.setRequestHeader('Content-type', 'application/json');

        const formData = new FormData(form);

        const object = {};
        formData.forEach(function(value, key) {
            object[key] = value;
        });

        const json  =  JSON.stringify(object);

        request.send(json);

        request.addEventListener('load', () => {
            if(request.status === 200){
                console.log(request.response);
                statusMessages.textContent = messages.seccess;
                form.reset();
                setTimeout(()=> {
                    statusMessages.remove();
                }, 2000);
            } else {
                statusMessages.textContent = messages.failuer;
            }
        })
    })
  }
});
