var mediaApp = angular.module('mediaApp', ['onsen']).config(function($sceProvider) {
    // For demonstration purposes only!
    // Completely disable SCE (Strict Contextual Escaping services) to allow all URLs to be loaded.
    $sceProvider.enabled(false);
})

mediaApp.controller('MainController', function (ItemsModel) {
    var main = this;
    this.searchTerm = "Gwen";
    this.numResults = "25";
    this.selType = "song";
    this.allowExplicit = true;

    this.search = function() {
        myNavigator.pushPage('list.html', { animation : 'slide' });
        ItemsModel.mediaType = this.selType;
        ItemsModel.numResults = this.numResults;
        ItemsModel.searchTerm = this.searchTerm;
        ItemsModel.allowExplicit = this.allowExplicit;
    }
    this.mediatypes = [{title:"Song",value: "song"},{title:"Video",value:"musicVideo"},{title:"Audiobook",value:"audiobook"}];
})

mediaApp.controller('ListController', function (ItemsModel) {
    var list = this;

    this.filterTerm = ""

    this.getResults = function() {
        ItemsModel.all()
            .then(function (result) {
                list.mediaItems = result.data;
            });
    }
    this.getResults();
    this.openDetail = function(item) {
        ItemsModel.setSelectedItem(item);
        myNavigator.pushPage('detail.html', { animation : 'lift' });
    };
})

mediaApp.controller('DetailController', function (ItemsModel) {
    this.selItem = ItemsModel.getSelectedItem();
})

mediaApp.controller('MenuController', function (ItemsModel) {
    // Needs to be implemented to handle settings, favorites etc
})

mediaApp.service('ItemsModel', function ($http) {
    var service = this;
    var selectedItem;

    service.all = function () {
        if (!service.allowExplicit)
            service.allowExplicit="no";

        return $http.jsonp("https://itunes.apple.com/search?entity=" + service.mediaType + "&term=" + service.searchTerm+"&limit=" +
            service.numResults +"&explicit=" + service.allowExplicit +"&callback=JSON_CALLBACK");
    };
    service.setSelectedItem = function(item) {
        selectedItem = item;
    }
    service.getSelectedItem = function() {
        return selectedItem;
    }
})
