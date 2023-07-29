// БИБЛИОТЕКА JQUERY
// $(document).ready(function(){ // загружать слайдер только тогда, когда документ полностью готов. $ - это и есть библиотека jQuery
//     $('.carousel__inner').slick({
//         //dots: true,
//         //infinite: true,
//         speed: 1200, //ms
//         //slidesToShow: 1,
//         //adaptiveHeight: true,
//         prevArrow: '<button type="button" class="slick-prev"><img src="img/catalogue/arrows/img_left_ar.png"></button>', 
//         nextArrow: '<button type="button" class="slick-next"><img src="img/catalogue/arrows/img_right_ar.png"></button>',
//         //arrows: false
//         //fade: true, //проявление картинки
//         //cssEase: 'linear' //тип проявления, здесь равномерное
//         // autoplay: true,
//         // autoplaySpeed: 2000
//         responsive: [ // для адаптации
//             {
//                 breakpoint: 992, // на каком промежутке работают правила (от 0 до 1024), все что выше 1024, будет работать по правилам, описанным ВЫШЕ
//                 settings: {
//                   dots: true,
//                   arrows: false
//                 }
//             }
//         ]
       
//       });
//   });

// TINY-SLIDER
const slider = tns({
    container: '.carousel__inner',
    items: 1,
    slideBy: 'page',
    autoplay: false,
    speed: 1200,
    controls: false,
    nav: false,
    autoHeight:true,
    //nested: true,
    responsive: {
        // 640: {
        //   edgePadding: 20,
        //   gutter: 20,
        //   items: 2
        // },
        // 700: {
        //   gutter: 30
        // },
        // 991: {
        //   items: 3
        // }
      }
  });

document.querySelector('.prev').addEventListener('click', function () { 
    slider.goTo('prev'); 
}); 

document.querySelector('.next').addEventListener('click', function () { 
    slider.goTo('next'); 
});

// изменения отображения на странице элементов в зависимости от выбранного таба
$(document).ready(function(){
    $('ul.catalogue__tabs').on('click', 'li:not(.catalogue__tab_active)', function() {
        $(this) //ссылается на элемент, на который только что нажали
          .addClass('catalogue__tab_active').siblings().removeClass('catalogue__tab_active')
          .closest('div.container').find('div.catalogue__content').removeClass('catalogue__content_active').eq($(this).index()).addClass('catalogue__content_active');
      });

    // $('.catalogue-item__link').each(function(i) {
    //     $(this).on('click', function(e) { // е тут обязательно для регулировки станд.поведения браузера
    //         e.preventDefault(); //убираем стандартное поведение браузера, чтобы при клике на ссылку, не отправляло в начало страницы
    //         $('.catalogue-item__content').eq(i).toggleClass('catalogue-item__content_active');
    //         $('.catalogue-item__list').eq(i).toggleClass('catalogue-item__list_active');
    //     })
    // })   

// смена информации внутри элемента при нажатии на раскр."меню"
    function toggleSlide(item) {
        $(item).each(function(i) {
            $(this).on('click', function(e) { // е тут обязательно для регулировки станд.поведения браузера
                e.preventDefault(); //убираем стандартное поведение браузера, чтобы при клике на ссылку, не отправляло в начало страницы
                $('.catalogue-item__content').eq(i).toggleClass('catalogue-item__content_active');
                $('.catalogue-item__list').eq(i).toggleClass('catalogue-item__list_active');
            })
        }) 
    };

    toggleSlide('.catalogue-item__link');
    toggleSlide('.catalogue-item__back');

     // Modal - должна быть подключена jQuery
    $('[data-modal=consultation]').on('click', function() { 
        $('.overlay, #consultation').fadeIn('slow'); //fadeOut - плавное скрытие элементов со страницы
    }); //квадратные скобки используются для атрибутов 

    $('.modal__close').on('click', function(){
        $('.overlay, #consultation, #thnx, #order').fadeOut('slow');
    });

    // убираем - будет описано ниже
    // $('.button_mini').on('click', function() {
    //     $('.overlay, #order').fadeIn('slow');
    // });

    // чтобы в модальное окно подставлялись разные названия пульсометров
    $('.button_mini').each(function(i) {
        $(this).on('click', function() {
            $('#order .modal__descr').text($('.catalogue-item__subtitle').eq(i).text()); //если оставить text() пустым, то текст будет получаться, если заполнить - передаваться
            $('.overlay, #order').fadeIn('slow');
        });
    });

    // валидация форм! с помощью плагина
    function validateForms(form) {
        $(form).validate({ // работает только на первом элементе данного селектора, поэтому нужно воспользоваться вложенностью уникальных айди, либо просто айди форм
            rules: {
                name: {
                    required: true,
                    minlength: 2
                  },
                phone: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: {
                    required: "Пожалуйста, введите свое имя",
                    minlength: jQuery.validator.format("Длина имени не должна быть менее {0} символов!")
                },
                phone: "Пожалуйста, введите свой номер телефона",
                email: {
                  required: "Пожалуйста, введите свою почту",
                  email: "Некорректный адрес электронной почты!"
                }
              }
        });
    };

    validateForms('#order form');
    validateForms('#consultation-form');
    validateForms('#consultation form');

    $('input[name=phone]').mask("+7 (999) 999-99-99");

    // отправка писем с формы
    $('form').submit(function(e) { // после того, как форма сабмитится - все данные с нее будут отправляться. e- even
        e.preventDefault(); // чтобы после отправки формы автоматически не было перезагрузки страницы
        if (!$(this).valid()) { // если форма не прошла валидацию - данные не отправятся на сервер
            return;
        }
        $.ajax({ // метод ajax - метод внутри jQuery
            type: "POST", // отправка данных, или взятие данных с сервера
            url: "mailer/smart.php", // куда будут отправляться данные
            data: $(this).serialize() // что за данные отправляются на сервер - данные с формы, к которым применен метод serialize
        }).done( function () { //что происходит после выполнения этой операции
            $(this).find("input").val(""); // очищаем форму после отправки
            $('#consultation, #order').fadeOut();
            $('.overlay, #thnx').fadeIn();

            $('form').trigger('reset'); //обновление форм
        }); 
        return false;
    }); 
});
  