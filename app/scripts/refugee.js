MAIN_URL = "http://gsw.pajowu.de/api/"
MAIN_URL = "http://localhost:8000/api/"
$(document).ready(function () {
    showHome();
    var option = {
        fallbackLng: 'en',
        ns: {
            namespaces: ['refugee']
        },
        detectLngQS: 'lang'
    };

    $.i18n.init(option).done(function () {
        $('[data-i18n]').i18n();
    }).fail(function () {
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
    var app = angular.module('gsw', ['nemLogging','leaflet-directive']);
    app.controller('FAQController', function($scope, $http) {
        $scope.faqData = {}
        $scope.loadFAQ = function() {
            for (var i=1;i<=3;i++) {
                $http.get(MAIN_URL + "faq/by-audience/" + i).success((function(key) {
                    return function(data) {
                        $scope.faqData[key] = data;
                    }
                })(i)).error((function(key) {
                    return function() {
                        $scope.faqData[key] = []
                    }
                })(i));
            }
        }
    });

    app.controller('POIController', ["$scope", "$http", "leafletData",  function($scope, $http, leafletData) {
        $scope.authorities = L.markerClusterGroup();
        $scope.wifi = L.markerClusterGroup();
        $scope.misc = L.markerClusterGroup();
        $scope.loadMap = function() {
            leafletData.getMap().then(function(map) {
                var overlayMaps = {
                    "Authorities": $scope.authorities,
                    "Wifi": $scope.wifi,
                    "Misc": $scope.misc
                };
                if ($scope.mapLayer != undefined) {
                    map.removeControl($scope.mapLayer);
                }
                $scope.mapLayer = L.control.layers(overlayMaps)
                $scope.mapLayer.addTo(map);
                mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
                L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; ' + mapLink + ' Contributors',
                        maxZoom: 18
                    }).addTo(map);
                map.invalidateSize();
            });
        }
        
        $http.get(MAIN_URL + "poi/").success(function(data, status) {
            $scope.data = data
            authorities = []
            wifi = []
            misc = []
            data.forEach(function(value, key) {
                geoj = value.location;
                geoj.properties = value;
                switch (value.type) {
                    case "authorities":
                    authorities.push(geoj)
                    break;
                    case "wifi":
                    wifi.push(geoj)
                    break;
                    default:
                    misc.push(geoj)
                    break;
                }

            });

            $scope.authorities.addLayer(L.geoJson(authorities, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.description);
                }
            }));
            $scope.wifi.addLayer(L.geoJson(wifi, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.description);
                }
            }));
            $scope.misc.addLayer(L.geoJson(misc, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.description);
                }
            }));
        });
        angular.extend($scope, {
            layers: [$scope.authorities],
            center: {
                "lat":50.9485795,
                "lng":6.9448561,
                zoom: 13,
            }
        });

    }]);
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['gsw']);
    });
});
function showHome() {
    $("#home").show();
    $("#dashboard").hide();
    $("#faq").hide();
    $("#map_container").hide();
    $('#nav').removeClass('fixed');
    $('#nav li.active').removeClass('active');
    $('#nav a#home_link').parent().addClass('active');
}
function showDashboard() {
    $("#home").hide();
    $("#dashboard").show();
    $("#faq").hide();
    $("#map_container").hide();
    $('#nav').removeClass('fixed');
    $('#nav li.active').removeClass('active');
    $('#nav a#dashboard_link').parent().addClass('active');
}
function showFAQ() {
    $("#home").hide();
    $("#dashboard").hide();
    $("#faq").show();
    $("#map_container").hide();
    $('#nav').removeClass('fixed');
    $('#nav li.active').removeClass('active');
    $('#nav a#faq_link').parent().addClass('active');
    angular.element("#faq").scope().loadFAQ();
}
function showMap() {
    $("#home").hide();
    $("#dashboard").hide();
    $("#faq").hide();
    $("#map_container").show();
    $('#nav').removeClass('fixed');
    $('#nav li.active').removeClass('active');
    $('#nav a#map_link').parent().addClass('active');
    angular.element("#map").scope().loadMap();

}