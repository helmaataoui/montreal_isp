var app = angular.module('myApp', ['pascalprecht.translate']);

var navLang = navigator.language ? navigator.language : 'fr'; //Some browser have null language ?!!

//Locales
app.config(['$translateProvider', function ($translateProvider) {

    $translateProvider.translations('en', {
        'BTN_CHANGE_LANG_ENG': 'English version',
        'BTN_CHANGE_LANG_FR': 'Version fran\u00E7aise',

        'TITLE': 'Montreal ISP Comparison',

        //Selection criterion bloc
        'SELECTION_CRITERION': 'Selection criterion',
        'MINIMUM_REQUIREMENTS': 'Minimum requirements',
        'DOWNLOAD_SPEED': 'Download speed',
        'BANDWIDTH': 'Bandwidth',
        'BUDGET': 'Budget',
        'MAXIMUM_MONTHLY_FEE': 'Maximum monthly fee',
        'ORDER_BY': 'Order by',
        'LOWEST_PRICE': 'Lowest price',
        'HIGHEST_BANDWIDTH_LIMIT': 'Highest bandwidth limit',
        'FASTEST_SPEED': 'Fastest speed',

        //Titles column
        'PLAN_NAME': 'Plan Name',
        'DOWNLOAD': 'Download',
        'UPLOAD': 'Upload',
        'BANDWIDTH_LIMIT': 'Bandwidth Limit',
        'MONTHLY_FEE': 'Monthly Fee',

        'MORE_DETAILS': 'More details',
        'NO_PLAN_FOUND': 'No plan found.',
        'NO_PLAN_FOUND_TIP': 'Not all filters need to be filled',

        'DOLLAR_MONTH': '$/month',
        'GB_MONTH': 'GB/month',

        'SHARE_MSG': 'Share this tool',
        'FOOTNOTES': 'This application was developped by Philippe Arteau using <a href="http://angularjs.org/">AngularJS</a>. ' +
            'It is release under <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons</a>.'
    });

    $translateProvider.translations('fr', {
        'BTN_CHANGE_LANG_ENG': 'English version',
        'BTN_CHANGE_LANG_FR': 'Version fran\u00E7aise',

        'TITLE': 'Comparatif des FAI \u00E0 Montr\u00E9al',

        //Selection criterion bloc
        'SELECTION_CRITERION': 'Crit\u00E8res de s\u00E9lection',
        'MINIMUM_REQUIREMENTS': 'Exigences minimales',
        'DOWNLOAD_SPEED': 'Vitesse de t\u00E9l\u00E9chargement',
        'BANDWIDTH': 'Bande passante',
        'BUDGET': 'Budget',
        'MAXIMUM_MONTHLY_FEE': 'Tarif mensuel maximal',
        'ORDER_BY': 'Tri\u00E9 par',
        'LOWEST_PRICE': 'Prix le plus bas',
        'HIGHEST_BANDWIDTH_LIMIT': 'Plus haute limite de bande passante',
        'FASTEST_SPEED': 'Vitesse la plus rapide',

        //Titles column
        'PLAN_NAME': 'Nom du forfait',
        'DOWNLOAD': 'T\u00E9l\u00E9chargement',
        'UPLOAD': 'T\u00E9l\u00E9versement',
        'BANDWIDTH_LIMIT': 'Limite de bande passante',
        'MONTHLY_FEE': 'Tarif mensuel',

        'MORE_DETAILS': 'Plus de d\u00E9tails',
        'NO_PLAN_FOUND': 'Aucun plan trouv\u00E9.',
        'NO_PLAN_FOUND_TIP': 'Il n\'est pas n\u00E9cessaire de remplir tous les filtres.',

        'DOLLAR_MONTH': '$/mois',
        'GB_MONTH': 'GB/mois',

        'SHARE_MSG': 'Partagez cet outil',
        'FOOTNOTES': 'Cette application a \u00E9t\u00E9 d\u00E9velopp\u00E9e par Philippe Arteau en utilisant <a href="http://angularjs.org/">AngularJS</a>. ' +
            'Elle est publi\u00E9e sous la license <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons</a>.'
    });


    var browserIsFrench = navLang.indexOf('fr') == 0;
    $translateProvider.preferredLanguage(browserIsFrench ? 'fr' : 'en');

}]);

//Controller
function PlanListCtrl($scope, $http, $translate) {
    $scope.plans = [];

    $scope.isFrench = navLang.indexOf('fr') == 0;

    $scope.changeLanguage = function (newLang) {
        $translate.uses(newLang);
        $scope.isFrench = newLang == 'fr'; //This trigger the language button to switch
    };

    //Create a plan from its properties
    $scope.addPlan = function (isp, name, downloadSpeed, uploadSpeed, bandwidthLimit, price, link) {
        $scope.plans.push(
            {"isp": isp,
                "name": name,
                "down_speed": downloadSpeed,
                "up_speed": uploadSpeed,
                "limit": bandwidthLimit,
                "price": price,
                "i_price": 1 / price, //Hack needed for multi-column sort
                "link": link,
                "icon": "images/" + isp.toLowerCase().replace("\u00E9", "e") + "_favicon.png"}
        );
    }

    //Loading ISP plans
    $http.get('data/all_plans.json').success(function (data) {

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            $scope.addPlan(item[0], item[1], item[2], item[3], item[4], item[5], item[6]);
        }
    });

    //Default filter (sort by lowest price, best download speed and than bandwidth)
    $scope.predicate = ["i_price", 'down_speed', 'limit'];

    //Serve as a filter on the main list
    $scope.criteriaMatch = function () {
        return function (item) {
            return (
                item.down_speed >= document.criteria.min_down_speed.value
                    && (item.limit >= document.criteria.min_download_limit.value || item.limit === null)
                    && (item.price <= document.criteria.montly_fee.value || document.criteria.montly_fee.value == '')
                );
        };
    }
}