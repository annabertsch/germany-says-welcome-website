$(document).ready(function () {
    var option = {
        fallbackLng: 'en',
        ns: {
            namespaces: ['index']
        },
        detectLngQS: 'lang'
    };

    $.i18n.init(option)
            .done(function () {
                $('[data-i18n]').i18n();
            })
            .fail(function () {
                $('[data-i18n]').i18n();
            });


    $('#lang-select li[lang]').on('click', function() {
        var lang = $(this).attr('lang');

        if(lang == "de"){
            $("#flag_de").show();
            $("#flag_en").hide();
        }

        if(lang == "en"){
            $("#flag_de").hide();
            $("#flag_en").show();
        }


        $('#lang-select li[lang]').removeClass("active");
        $(this).addClass("active");
        $.i18n.setLng(lang, function(){
            $('[data-i18n]').i18n();
        });
    });
});