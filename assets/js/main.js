jQuery(document).ready(function($) {
/*////////////////////////////////////////////////
/////// BACK TO TOP BUTTON
///////////////////////*/
    if ($('#back-to-top').length) {
        var scrollTrigger = 100, // px
            backToTop = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    };
    


/*////////////////////////////////////////////////
/////// Collapse on Mobile - adiciona e remove classes onClicks
///////////////////////*/
    $(".collapse-button").click(function(event) {
        let parent = $(this).attr('data-id');        
        $(".card-header").removeClass('collapse-open');
        $(".collapse-icon").removeClass('fa-minus');
        $(".collapse-icon").addClass('fa-plus');
        $(`#icon-${parent}`).toggleClass('fa-minus');
        $(`#${parent}`).toggleClass('collapse-open');
    });

/*////////////////////////////////////////////////
/////// Carrousel - produtos relacionados - pagina de produto
///////////////////////*/

        $(".owl-carousel.products").owlCarousel(
            {
                loop:true,
                autoplay: true,
                nav: true,
                navText: ["<i class='fas fa-angle-left icon-nav-product'></i>","<i class='fas fa-angle-right icon-nav-product'></i>"],
                responsiveClass:true,
                responsive:{
                    0:{
                        items:1,
                        nav:true
                    },
                    600:{
                        items:3,
                        nav:false
                    },
                    1000:{
                        items:6,
                        nav:true,
                        loop:false
                    }
                }
            }
        );

        $(".owl-carousel.slide-home").owlCarousel(
            {
                loop:true,
                center: true,
                items:1,
                nav: true,
                navText: ["<i class='fas fa-angle-left icon-nav-home'></i>","<i class='fas fa-angle-right icon-nav-home'></i>"],
                responsiveClass: true
            }
        );

    // Teste menu
    // $('.dropdown-menu > li > a').on("click", function(e) {
    //     var submenu = $(this);
    //     $('.dropdown-menu .dropdown-menu').removeClass('show');
    //     submenu.next('.dropdown-menu').addClass('show');
    //     e.stopPropagation();
    // });

    // $('.dropdown').on("hidden.bs.dropdown", function() {
    //     // hide any open menus when parent closes
    //     $('.dropdown-menu.show').removeClass('show');
    // });

/*////////////////////////////////////////////////
/////// MÁSCARAS DE CAMPOS E VALIDAÇÕES DO CHECKOUT
///////////////////////*/

    /**** variaveis para validação de campos */
    var name_hasError = null,
        last_name_hasError = null,
        cpf_hasError = null,
        phone_hasError = null,
        cep_hasError = null;


    /**** MÁSCARAS DE CAMPO */
    var SPMaskBehavior = function (val) {
      return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    spOptions = {
      onKeyPress: function(val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
    };
    $('#billing_cpf').mask('000.000.000-00');
    $('#billing_postcode').mask('00000-000');
    $('#billing_phone').mask(SPMaskBehavior, spOptions);


    /**** VALIDAÇÃO DE NOMES */
    $('#billing_first_name').blur(function(event) {
        let len = $(this).val().length;
        if(len < 2){            
            $("#billing_first_name").css('border-color',  'red');
            name_hasError = 1;
        }
        else{            
            $("#billing_first_name").css('border-color',  'limegreen');
            name_hasError = 0;
        }
    });
    $('#billing_last_name').blur(function(event) {
        let len = $(this).val().length;
        if(len < 2){
            $("#billing_last_name").css('border-color',  'red');
            last_name_hasError = 1;
        }
        else{
            $("#billing_last_name").css('border-color',  'limegreen');
            last_name_hasError = 0;
        }
    });


    ////////////////////////////
    ///////***** VERIFICAÇÃO DE CPF *****
    ///////////////////
    validaCpf = {
        go: function(cpf){            
            if( cpf.length  > 0 && cpf.length  < 14 ){
                alert('cpf invalido')
                $("#billing_cpf").css('border-color',  'red');
                $("#billing_cpf").val('').focus();
                $("#billing_cpf").attr('placeholder', 'Digite seu cpf válido');
                cpf_hasError = 1;
                return;
            }
    
            if( cpf.length  === 14 ) {
                if(valida_cpf_cnpj( cpf )){
                    $("#billing_cpf").css('border-color',  'limegreen');
                    cpf_hasError = 0;
                }else {
                    alert('cpf invalido')
                    $("#billing_cpf").css('border-color',  'red');
                    $("#billing_cpf").val('').focus();
                    $("#billing_cpf").attr('placeholder', 'CPF Inválido');
                    cpf_hasError = 1;
                }            
            }
        }
    }

    // if( $('#billing_cpf').val() != '' ){
    //     let cpf = $('#billing_cpf').val();
    //     alert('cpf' + cpf);
    //     console.log('cpf está preenchido: '+cpf);
    //     validaCpf.go(cpf);
    // }
    $('#billing_cpf').focusout(function(event) {
        let cpf = $('#billing_cpf').val();
        console.log('cpf digitado: '+cpf);  
        validaCpf.go(cpf);
    });


    ////////////////////////////
    ///////***** VERIFICAÇÃO DE TELEFONE *****
    ///////////////////    
    validaPhone = {
        go: function(phone){
            if(phone.length < 14){            
                $("#billing_phone").css('border-color',  'red');
                $("#billing_phone").val('').focus();
                $("#billing_phone").attr('placeholder', 'Telefone Inválido'); 
                phone_hasError = 1; 
            }
            else
            {
                $("#billing_phone").css('border-color',  'limegreen');
                phone_hasError = 0;
            }
        }
    }

    // if($('#billing_phone').val() != ''){        
    //     let phone = $('#billing_phone').val(); 
    //     validaPhone.go(phone);
    // }
    $('#billing_phone').change(function(){  
        let phone = $('#billing_phone').val(); 
        validaPhone.go(phone);                
    });

    ////////////////////////////
    ///////***** VERIFICAÇÃO E AUTOCOMPLETE DE CEP *****
    ///////////////////
    validaCep = {
        go: function(cep, len){
            if(len === 9){
                $.get(`https://viacep.com.br/ws/${cep}/json`, function(data) {
                    if(data.erro == true){
                        $("#billing_postcode").css('border-color',  'red');
                        $("#billing_postcode").attr('placeholder', 'Cep Inválido');
                        $("#billing_postcode").val('').focus();
                        return;
                    }
                    autofillCep.go(data);        
                });
            }
        }
    }

    autofillCep = {
        go: function(data){ 
            $("#billing_postcode").css('border-color',  'limegreen');
    
            $("#billing_address_1").val(data.logradouro);
            $("#billing_address_1").css('border-color',  'limegreen');

            if( $('#billing_number').val() != '' )
                $('#billing_number').css('border-color',  'limegreen');
    
            $("#billing_neighborhood").val(data.bairro);
            $("#billing_neighborhood").css('border-color',  'limegreen');                
                            
            $("#billing_city").css('border-color',  'limegreen');                
            $('#billing_city').val(data.localidade);
    
            $('#billing_state option[value="'+data.uf+'"]').prop('selected', true); 
            $("#select2-billing_state-container").attr('title', data.uf);
            $("#select2-billing_state-container").html(data.uf);
            $(".select2-selection--single").css('border-color',  'limegreen');
            $("#billing_state option").each(function () {
                if($(this).val() == data.uf){
                    $(this).prop('selected', true);
                }
            });
            cep_hasError = 0;
    
            $("#billing_number").focus();
        }
    }

    // if(  $('#billing_postcode').val() != '' ){        
    //     let cep = $('#billing_postcode').val();
    //     let len = $('#billing_postcode').val().length;
    //     validaCep.go(cep, len);        
    // }
    $('#billing_postcode').keyup(function(event) {
        let cep = $('#billing_postcode').val();
        let len = $('#billing_postcode').val().length;
        if(len === 9){
            validaCep.go(cep, len);  
        }  
    });
    // ******* FIM DA VALIDAÇÃO DE CEP *******************

    

    $('.button-tabs').click(function(event) {
        event.preventDefault();
        let item = $(this).attr('id');
        $('.tab-child').hide();
        $('#'+item).show();

        switch ($(this).attr('data-tab')) {
            case "tab-one":
                changeTabs.go( $(this).attr('data-tab'), '#btn-cart', '#btn-two' );
                
                $('.ball').removeClass('active');
                $('#checkout-step1').addClass('active');
                $('#icon-seta-step-left').css('display', 'none');
                $('#icon-seta-step-right').css('display', 'inline-block');
                $('#btn-two').removeClass('last-step');      
                break;
            case "tab-two":
                validateForm.validate($(this).attr('data-tab'), '#btn-one', '#btn-three');

                let endereco = $('#billing_address_1').val();
                let numero = $('#billing_number').val();
                let bairro = $('#billing_neighborhood').val();
                let cidade = $('#billing_city').val();
                let estado = $('#select2-billing_state-container').text();
                
                let string = `<p><strong>Endereço:</strong> ${endereco}</p> <p><strong>Número:</strong> ${numero}</p> <p><strong>Bairro:</strong> ${bairro}</p> <p><strong>Cidade/UF:</strong> ${cidade}/${estado}</p>`;
                $('#local-de-entrega').html(string);
                
                break;
            case "tab-three":
                changeTabs.go( $(this).attr('data-tab'), '#btn-two', '#btn-checkout' );                
                
                $('.ball').removeClass('active');
                $('#checkout-step1').addClass('active');
                $('#checkout-step2').addClass('active');
                $('#checkout-step3').addClass('active');
                $('#icon-seta-step-right').css('display', 'none');
                $('#icon-seta-step-left').css('display', 'inline-block');
                $('#btn-two').addClass('last-step');
                break;
            default:
                alert('erro');
                break;
        };

    });

    changeTabs = {
        go: function(tab, btnleft, btnright){
            $('.tab-child').hide();
            $('#'+tab).show();
            $('#checkout-step-buttons a').hide();
            $(btnleft).show().css('float', 'left'); //$(btnleft);
            $(btnright).show().css('float', 'right'); //$(btnright);
        }        
    };

    validateForm = {
        validate: function(tab, btnleft, btnright){
            changeTabs.go( tab, btnleft, btnright );
            if( $('#checkout-form').attr('data-status') == 'loged' ){
               changeTabs.go( tab, btnleft, btnright );
               $('#checkout-step1').addClass('active');
               $('#checkout-step2').addClass('active');
            }else{
                if(name_hasError == 0 && last_name_hasError == 0 && cpf_hasError == 0 && phone_hasError == 0 && cep_hasError == 0){
                    changeTabs.go( tab, btnleft, btnright )
                    $('.ball').removeClass('active');
                    $('#checkout-step1').addClass('active');
                    $('#checkout-step2').addClass('active');
                }
                else{
                    //changeTabs.go( tab, btnleft, btnright )
                    changeTabs.go( 'tab-one', '#btn-cart', '#btn-two' );
                    alert("Preencha o formulário corretamente");
                    console.log(
                        {'name':name_hasError, 'lastname':last_name_hasError, 'cpf':cpf_hasError, 'phone':phone_hasError, 'cep':cep_hasError}
                    )
                }
            }            
        }
    };


}); // END jQuery



function verifica_cpf_cnpj ( valor ) {

    // Garante que o valor é uma string
    valor = valor.toString();
    
    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    // Verifica CPF
    if ( valor.length === 11 ) {
        return 'CPF';
    } 
    
    // Verifica CNPJ
    else if ( valor.length === 14 ) {
        return 'CNPJ';
    } 
    
    // Não retorna nada
    else {
        return false;
    }
    
} // verifica_cpf_cnpj

/*
 calc_digitos_posicoes
 
 Multiplica dígitos vezes posições
 
 @param string digitos Os digitos desejados
 @param string posicoes A posição que vai iniciar a regressão
 @param string soma_digitos A soma das multiplicações entre posições e dígitos
 @return string Os dígitos enviados concatenados com o último dígito
*/
function calc_digitos_posicoes( digitos, posicoes = 10, soma_digitos = 0 ) {

    // Garante que o valor é uma string
    digitos = digitos.toString();

    // Faz a soma dos dígitos com a posição
    // Ex. para 10 posições:
    //   0    2    5    4    6    2    8    8   4
    // x10   x9   x8   x7   x6   x5   x4   x3  x2
    //   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
    for ( var i = 0; i < digitos.length; i++  ) {
        // Preenche a soma com o dígito vezes a posição
        soma_digitos = soma_digitos + ( digitos[i] * posicoes );

        // Subtrai 1 da posição
        posicoes--;

        // Parte específica para CNPJ
        // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
        if ( posicoes < 2 ) {
            // Retorno a posição para 9
            posicoes = 9;
        }
    }

    // Captura o resto da divisão entre soma_digitos dividido por 11
    // Ex.: 196 % 11 = 9
    soma_digitos = soma_digitos % 11;

    // Verifica se soma_digitos é menor que 2
    if ( soma_digitos < 2 ) {
        // soma_digitos agora será zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado é 11 menos soma_digitos
        // Ex.: 11 - 9 = 2
        // Nosso dígito procurado é 2
        soma_digitos = 11 - soma_digitos;
    }

    // Concatena mais um dígito aos primeiro nove dígitos
    // Ex.: 025462884 + 2 = 0254628842
    var cpf = digitos + soma_digitos;

    // Retorna
    return cpf;
    
} // calc_digitos_posicoes

/*
 Valida CPF
 
 Valida se for CPF
 
 @param  string cpf O CPF com ou sem pontos e traço
 @return bool True para CPF correto - False para CPF incorreto
*/
function valida_cpf( valor ) {

    // Garante que o valor é uma string
    valor = valor.toString();
    
    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Captura os 9 primeiros dígitos do CPF
    // Ex.: 02546288423 = 025462884
    var digitos = valor.substr(0, 9);

    // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
    var novo_cpf = calc_digitos_posicoes( digitos );

    // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
    var novo_cpf = calc_digitos_posicoes( novo_cpf, 11 );

    // Verifica se o novo CPF gerado é idêntico ao CPF enviado
    if ( novo_cpf === valor ) {
        // CPF válido
        return true;
    } else {
        // CPF inválido
        return false;
    }
    
} // valida_cpf

/*
 valida_cnpj
 
 Valida se for um CNPJ
 
 @param string cnpj
 @return bool true para CNPJ correto
*/
function valida_cnpj ( valor ) {

    // Garante que o valor é uma string
    valor = valor.toString();
    
    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    
    // O valor original
    var cnpj_original = valor;

    // Captura os primeiros 12 números do CNPJ
    var primeiros_numeros_cnpj = valor.substr( 0, 12 );

    // Faz o primeiro cálculo
    var primeiro_calculo = calc_digitos_posicoes( primeiros_numeros_cnpj, 5 );

    // O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
    var segundo_calculo = calc_digitos_posicoes( primeiro_calculo, 6 );

    // Concatena o segundo dígito ao CNPJ
    var cnpj = segundo_calculo;

    // Verifica se o CNPJ gerado é idêntico ao enviado
    if ( cnpj === cnpj_original ) {
        return true;
    }
    
    // Retorna falso por padrão
    return false;
    
} // valida_cnpj

/*
 valida_cpf_cnpj
 
 Valida o CPF ou CNPJ
 
 @access public
 @return bool true para válido, false para inválido
*/
function valida_cpf_cnpj ( valor ) {

    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj( valor );

    // Garante que o valor é uma string
    valor = valor.toString();
    
    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if ( valida === 'CPF' ) {
        // Retorna true para cpf válido
        return valida_cpf( valor );
    } 
    
    // Valida CNPJ
    else if ( valida === 'CNPJ' ) {
        // Retorna true para CNPJ válido
        return valida_cnpj( valor );
    } 
    
    // Não retorna nada
    else {
        return false;
    }
    
} // valida_cpf_cnpj

/*
 formata_cpf_cnpj
 
 Formata um CPF ou CNPJ

 @access public
 @return string CPF ou CNPJ formatado
*/
function formata_cpf_cnpj( valor ) {

    // O valor formatado
    var formatado = false;
    
    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj( valor );

    // Garante que o valor é uma string
    valor = valor.toString();
    
    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Valida CPF
    if ( valida === 'CPF' ) {
    
        // Verifica se o CPF é válido
        if ( valida_cpf( valor ) ) {
        
            // Formata o CPF ###.###.###-##
            formatado  = valor.substr( 0, 3 ) + '.';
            formatado += valor.substr( 3, 3 ) + '.';
            formatado += valor.substr( 6, 3 ) + '-';
            formatado += valor.substr( 9, 2 ) + '';
            
        }
        
    }
    
    // Valida CNPJ
    else if ( valida === 'CNPJ' ) {
    
        // Verifica se o CNPJ é válido
        if ( valida_cnpj( valor ) ) {
        
            // Formata o CNPJ ##.###.###/####-##
            formatado  = valor.substr( 0,  2 ) + '.';
            formatado += valor.substr( 2,  3 ) + '.';
            formatado += valor.substr( 5,  3 ) + '/';
            formatado += valor.substr( 8,  4 ) + '-';
            formatado += valor.substr( 12, 14 ) + '';
            
        }
        
    } 

    // Retorna o valor 
    return formatado;
    
} // formata_cpf_cnpj






/**
 * sticky-sidebar - A JavaScript plugin for making smart and high performance.
 * @version v3.3.1
 * @link https://github.com/abouolia/sticky-sidebar
 * @author Ahmed Bouhuolia
 * @license The MIT License (MIT)
**/
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.StickySidebar=e()}(this,function(){"use strict";"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function t(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function e(t,e){return t(e={exports:{}},e.exports),e.exports}var i=e(function(t,e){(function(t){Object.defineProperty(t,"__esModule",{value:!0});var l,n,e=function(){function n(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}}(),i=(l=".stickySidebar",n={topSpacing:0,bottomSpacing:0,containerSelector:!1,innerWrapperSelector:".inner-wrapper-sticky",stickyClass:"is-affixed",resizeSensor:!0,minWidth:!1},function(){function c(t){var e=this,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,c),this.options=c.extend(n,i),this.sidebar="string"==typeof t?document.querySelector(t):t,void 0===this.sidebar)throw new Error("There is no specific sidebar element.");this.sidebarInner=!1,this.container=this.sidebar.parentElement,this.affixedType="STATIC",this.direction="down",this.support={transform:!1,transform3d:!1},this._initialized=!1,this._reStyle=!1,this._breakpoint=!1,this.dimensions={translateY:0,maxTranslateY:0,topSpacing:0,lastTopSpacing:0,bottomSpacing:0,lastBottomSpacing:0,sidebarHeight:0,sidebarWidth:0,containerTop:0,containerHeight:0,viewportHeight:0,viewportTop:0,lastViewportTop:0},["handleEvent"].forEach(function(t){e[t]=e[t].bind(e)}),this.initialize()}return e(c,[{key:"initialize",value:function(){var i=this;if(this._setSupportFeatures(),this.options.innerWrapperSelector&&(this.sidebarInner=this.sidebar.querySelector(this.options.innerWrapperSelector),null===this.sidebarInner&&(this.sidebarInner=!1)),!this.sidebarInner){var t=document.createElement("div");for(t.setAttribute("class","inner-wrapper-sticky"),this.sidebar.appendChild(t);this.sidebar.firstChild!=t;)t.appendChild(this.sidebar.firstChild);this.sidebarInner=this.sidebar.querySelector(".inner-wrapper-sticky")}if(this.options.containerSelector){var e=document.querySelectorAll(this.options.containerSelector);if((e=Array.prototype.slice.call(e)).forEach(function(t,e){t.contains(i.sidebar)&&(i.container=t)}),!e.length)throw new Error("The container does not contains on the sidebar.")}"function"!=typeof this.options.topSpacing&&(this.options.topSpacing=parseInt(this.options.topSpacing)||0),"function"!=typeof this.options.bottomSpacing&&(this.options.bottomSpacing=parseInt(this.options.bottomSpacing)||0),this._widthBreakpoint(),this.calcDimensions(),this.stickyPosition(),this.bindEvents(),this._initialized=!0}},{key:"bindEvents",value:function(){window.addEventListener("resize",this,{passive:!0,capture:!1}),window.addEventListener("scroll",this,{passive:!0,capture:!1}),this.sidebar.addEventListener("update"+l,this),this.options.resizeSensor&&"undefined"!=typeof ResizeSensor&&(new ResizeSensor(this.sidebarInner,this.handleEvent),new ResizeSensor(this.container,this.handleEvent))}},{key:"handleEvent",value:function(t){this.updateSticky(t)}},{key:"calcDimensions",value:function(){if(!this._breakpoint){var t=this.dimensions;t.containerTop=c.offsetRelative(this.container).top,t.containerHeight=this.container.clientHeight,t.containerBottom=t.containerTop+t.containerHeight,t.sidebarHeight=this.sidebarInner.offsetHeight,t.sidebarWidth=this.sidebarInner.offsetWidth,t.viewportHeight=window.innerHeight,t.maxTranslateY=t.containerHeight-t.sidebarHeight,this._calcDimensionsWithScroll()}}},{key:"_calcDimensionsWithScroll",value:function(){var t=this.dimensions;t.sidebarLeft=c.offsetRelative(this.sidebar).left,t.viewportTop=document.documentElement.scrollTop||document.body.scrollTop,t.viewportBottom=t.viewportTop+t.viewportHeight,t.viewportLeft=document.documentElement.scrollLeft||document.body.scrollLeft,t.topSpacing=this.options.topSpacing,t.bottomSpacing=this.options.bottomSpacing,"function"==typeof t.topSpacing&&(t.topSpacing=parseInt(t.topSpacing(this.sidebar))||0),"function"==typeof t.bottomSpacing&&(t.bottomSpacing=parseInt(t.bottomSpacing(this.sidebar))||0),"VIEWPORT-TOP"===this.affixedType?t.topSpacing<t.lastTopSpacing&&(t.translateY+=t.lastTopSpacing-t.topSpacing,this._reStyle=!0):"VIEWPORT-BOTTOM"===this.affixedType&&t.bottomSpacing<t.lastBottomSpacing&&(t.translateY+=t.lastBottomSpacing-t.bottomSpacing,this._reStyle=!0),t.lastTopSpacing=t.topSpacing,t.lastBottomSpacing=t.bottomSpacing}},{key:"isSidebarFitsViewport",value:function(){var t=this.dimensions,e="down"===this.scrollDirection?t.lastBottomSpacing:t.lastTopSpacing;return this.dimensions.sidebarHeight+e<this.dimensions.viewportHeight}},{key:"observeScrollDir",value:function(){var t=this.dimensions;if(t.lastViewportTop!==t.viewportTop){var e="down"===this.direction?Math.min:Math.max;t.viewportTop===e(t.viewportTop,t.lastViewportTop)&&(this.direction="down"===this.direction?"up":"down")}}},{key:"getAffixType",value:function(){this._calcDimensionsWithScroll();var t=this.dimensions,e=t.viewportTop+t.topSpacing,i=this.affixedType;return e<=t.containerTop||t.containerHeight<=t.sidebarHeight?(t.translateY=0,i="STATIC"):i="up"===this.direction?this._getAffixTypeScrollingUp():this._getAffixTypeScrollingDown(),t.translateY=Math.max(0,t.translateY),t.translateY=Math.min(t.containerHeight,t.translateY),t.translateY=Math.round(t.translateY),t.lastViewportTop=t.viewportTop,i}},{key:"_getAffixTypeScrollingDown",value:function(){var t=this.dimensions,e=t.sidebarHeight+t.containerTop,i=t.viewportTop+t.topSpacing,n=t.viewportBottom-t.bottomSpacing,o=this.affixedType;return this.isSidebarFitsViewport()?t.sidebarHeight+i>=t.containerBottom?(t.translateY=t.containerBottom-e,o="CONTAINER-BOTTOM"):i>=t.containerTop&&(t.translateY=i-t.containerTop,o="VIEWPORT-TOP"):t.containerBottom<=n?(t.translateY=t.containerBottom-e,o="CONTAINER-BOTTOM"):e+t.translateY<=n?(t.translateY=n-e,o="VIEWPORT-BOTTOM"):t.containerTop+t.translateY<=i&&0!==t.translateY&&t.maxTranslateY!==t.translateY&&(o="VIEWPORT-UNBOTTOM"),o}},{key:"_getAffixTypeScrollingUp",value:function(){var t=this.dimensions,e=t.sidebarHeight+t.containerTop,i=t.viewportTop+t.topSpacing,n=t.viewportBottom-t.bottomSpacing,o=this.affixedType;return i<=t.translateY+t.containerTop?(t.translateY=i-t.containerTop,o="VIEWPORT-TOP"):t.containerBottom<=n?(t.translateY=t.containerBottom-e,o="CONTAINER-BOTTOM"):this.isSidebarFitsViewport()||t.containerTop<=i&&0!==t.translateY&&t.maxTranslateY!==t.translateY&&(o="VIEWPORT-UNBOTTOM"),o}},{key:"_getStyle",value:function(t){if(void 0!==t){var e={inner:{},outer:{}},i=this.dimensions;switch(t){case"VIEWPORT-TOP":e.inner={position:"fixed",top:i.topSpacing,left:i.sidebarLeft-i.viewportLeft,width:i.sidebarWidth};break;case"VIEWPORT-BOTTOM":e.inner={position:"fixed",top:"auto",left:i.sidebarLeft,bottom:i.bottomSpacing,width:i.sidebarWidth};break;case"CONTAINER-BOTTOM":case"VIEWPORT-UNBOTTOM":var n=this._getTranslate(0,i.translateY+"px");e.inner=n?{transform:n}:{position:"absolute",top:i.translateY,width:i.sidebarWidth}}switch(t){case"VIEWPORT-TOP":case"VIEWPORT-BOTTOM":case"VIEWPORT-UNBOTTOM":case"CONTAINER-BOTTOM":e.outer={height:i.sidebarHeight,position:"relative"}}return e.outer=c.extend({height:"",position:""},e.outer),e.inner=c.extend({position:"relative",top:"",left:"",bottom:"",width:"",transform:""},e.inner),e}}},{key:"stickyPosition",value:function(t){if(!this._breakpoint){t=this._reStyle||t||!1,this.options.topSpacing,this.options.bottomSpacing;var e=this.getAffixType(),i=this._getStyle(e);if((this.affixedType!=e||t)&&e){var n="affix."+e.toLowerCase().replace("viewport-","")+l;for(var o in c.eventTrigger(this.sidebar,n),"STATIC"===e?c.removeClass(this.sidebar,this.options.stickyClass):c.addClass(this.sidebar,this.options.stickyClass),i.outer){var s="number"==typeof i.outer[o]?"px":"";this.sidebar.style[o]=i.outer[o]+s}for(var r in i.inner){var a="number"==typeof i.inner[r]?"px":"";this.sidebarInner.style[r]=i.inner[r]+a}var p="affixed."+e.toLowerCase().replace("viewport-","")+l;c.eventTrigger(this.sidebar,p)}else this._initialized&&(this.sidebarInner.style.left=i.inner.left);this.affixedType=e}}},{key:"_widthBreakpoint",value:function(){window.innerWidth<=this.options.minWidth?(this._breakpoint=!0,this.affixedType="STATIC",this.sidebar.removeAttribute("style"),c.removeClass(this.sidebar,this.options.stickyClass),this.sidebarInner.removeAttribute("style")):this._breakpoint=!1}},{key:"updateSticky",value:function(){var t,e=this,i=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};this._running||(this._running=!0,t=i.type,requestAnimationFrame(function(){switch(t){case"scroll":e._calcDimensionsWithScroll(),e.observeScrollDir(),e.stickyPosition();break;case"resize":default:e._widthBreakpoint(),e.calcDimensions(),e.stickyPosition(!0)}e._running=!1}))}},{key:"_setSupportFeatures",value:function(){var t=this.support;t.transform=c.supportTransform(),t.transform3d=c.supportTransform(!0)}},{key:"_getTranslate",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0,i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:0;return this.support.transform3d?"translate3d("+t+", "+e+", "+i+")":!!this.support.translate&&"translate("+t+", "+e+")"}},{key:"destroy",value:function(){window.removeEventListener("resize",this,{capture:!1}),window.removeEventListener("scroll",this,{capture:!1}),this.sidebar.classList.remove(this.options.stickyClass),this.sidebar.style.minHeight="",this.sidebar.removeEventListener("update"+l,this);var t={inner:{},outer:{}};for(var e in t.inner={position:"",top:"",left:"",bottom:"",width:"",transform:""},t.outer={height:"",position:""},t.outer)this.sidebar.style[e]=t.outer[e];for(var i in t.inner)this.sidebarInner.style[i]=t.inner[i];this.options.resizeSensor&&"undefined"!=typeof ResizeSensor&&(ResizeSensor.detach(this.sidebarInner,this.handleEvent),ResizeSensor.detach(this.container,this.handleEvent))}}],[{key:"supportTransform",value:function(t){var i=!1,e=t?"perspective":"transform",n=e.charAt(0).toUpperCase()+e.slice(1),o=document.createElement("support").style;return(e+" "+["Webkit","Moz","O","ms"].join(n+" ")+n).split(" ").forEach(function(t,e){if(void 0!==o[t])return i=t,!1}),i}},{key:"eventTrigger",value:function(t,e,i){try{var n=new CustomEvent(e,{detail:i})}catch(t){(n=document.createEvent("CustomEvent")).initCustomEvent(e,!0,!0,i)}t.dispatchEvent(n)}},{key:"extend",value:function(t,e){var i={};for(var n in t)void 0!==e[n]?i[n]=e[n]:i[n]=t[n];return i}},{key:"offsetRelative",value:function(t){var e={left:0,top:0};do{var i=t.offsetTop,n=t.offsetLeft;isNaN(i)||(e.top+=i),isNaN(n)||(e.left+=n),t="BODY"===t.tagName?t.parentElement:t.offsetParent}while(t);return e}},{key:"addClass",value:function(t,e){c.hasClass(t,e)||(t.classList?t.classList.add(e):t.className+=" "+e)}},{key:"removeClass",value:function(t,e){c.hasClass(t,e)&&(t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," "))}},{key:"hasClass",value:function(t,e){return t.classList?t.classList.contains(e):new RegExp("(^| )"+e+"( |$)","gi").test(t.className)}},{key:"defaults",get:function(){return n}}]),c}());t.default=i,window.StickySidebar=i})(e)});return t(i),t(e(function(t,e){(function(t){var e,s=(e=t)&&e.__esModule?e:{default:e};!function(){if("undefined"!=typeof window){var n=window.$||window.jQuery||window.Zepto,o="stickySidebar";if(n){n.fn.stickySidebar=function(i){return this.each(function(){var t=n(this),e=n(this).data(o);if(e||(e=new s.default(this,"object"==typeof i&&i),t.data(o,e)),"string"==typeof i){if(void 0===e[i]&&-1===["destroy","updateSticky"].indexOf(i))throw new Error('No method named "'+i+'"');e[i]()}})},n.fn.stickySidebar.Constructor=s.default;var t=n.fn.stickySidebar;n.fn.stickySidebar.noConflict=function(){return n.fn.stickySidebar=t,this}}}}()})(i)}))});