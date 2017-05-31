app.controller('zoneCtr', ['$http','$rootScope','$scope','$timeout',function ($http,$rootScope,$scope,$timeout) {
    //hidePreloader();
    $timeout(function(){
        $('.tabsContainer .tabs a').removeClass('active');
        $('.tabsContainer .tabs .zones').addClass('active');
    },0,false);
    $scope.getSitesList = function(){
        showPreloader();
        var url=$rootScope.baseUrl+ '/api/Sites/getAllSites';
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log(response);
            if(response.data.returnStatus=="SUCCESS"){
                if(response.data.responseData.length!=0){
                    var sites = JSON.stringify(response.data.responseData);
                    sites = JSON.parse(sites);
                    $scope.sites=[];
                    $scope.sites = sites;
                    $scope.selectedSite = $scope.sites[0];
                    console.log('selectedSite id is'+$scope.selectedSite);
                    $timeout(function () { 
                          $('select').material_select();
                    }, 0, false);
                    $scope.getZonesList(sites[0].siteId);

                }else{
                    Materialize.toast('No sites present,Please add a site',2000);
                    hidePreloader();
                    return;
                }
            }else{
                Materialize.toast('Error occured, please refresh the page',2000);
                hidePreloader();
            }
        },function errorCallback(response) {
            Materialize.toast('Error occured, please refresh the page',2000);
            hidePreloader();
        });
    };
    $scope.getZonesList = function(siteId){
        console.log('selectedSite id is'+$scope.selectedSite+' '+siteId);
    	showPreloader();
        $scope.zones=[];
        var url=$rootScope.baseUrl+ '/api/Zones/getAllZones?siteId='+siteId;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
        	console.log(response);
        	if(response.data.returnStatus=="SUCCESS"){
        		if(response.data.responseData.length!=0){
        			var zones = JSON.stringify(response.data.responseData);
        			zones = JSON.parse(zones);
        			$scope.zones=[];
        			$scope.zones = zones;
        			hidePreloader();
        		}else{
        			Materialize.toast('No zones present,Please add a zone',2000);
        			hidePreloader();
        			return;
        		}
        	}else{
        		Materialize.toast('Error occured, please refresh the page',2000);
        		hidePreloader();
        	}
        },function errorCallback(response) {
            Materialize.toast('Error occured, please refresh the page',2000);
            hidePreloader();
        });
    };
    $scope.selectChanged = function(){
        console.log('selected site before timeout '+$scope.selectedSite.siteId);
        $timeout(function () { 
            var selectedSite = $scope.selectedSite;
            console.log('selected site after timeout  '+$scope.selectedSite.siteId);
            $scope.getZonesList(selectedSite.siteId);
        }, 0, false);
    }
    $scope.deleteZone = function(zone){
    	showPreloader();
    	var url=$rootScope.baseUrl+ '/api/Zones/deleteZone?zoneId='+zone.loginId;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
        	console.log(response);
        	if(response.data.returnStatus=="SUCCESS"){
        		Materialize.toast('Zone deleted',2000);
        		$scope.getZonesList();
        	}else{
        		Materialize.toast('Error occured, please refresh the page',2000);
        		hidePreloader();
        	}
        },function errorCallback(response) {
            Materialize.toast('Error occured, please refresh the page',2000);
            hidePreloader();
        });
    };

    $scope.createZoneClicked = function(){
    	$scope.zonename = '';
    	$scope.zoneimei='';
    	$('#createZoneModal').openModal({dismissible:true},1);
    };
    $scope.createZone = function(){
    	var zonename = $scope.zonename;
    	var zoneimei= $scope.zoneimei;
        if($scope.selectedSite.siteId == undefined){
            var selectedSite = $scope.selectedSite;
        }else{
            var selectedSite = $scope.selectedSite.siteId;
        }
    	var error=false;
    	if(!zonename.replace(/\s/g, '').length){
    		var html = 'Enter an zonename';
			$('#zonename-error').addClass('error');
    		$('#zonename-error').text(html);
    		$('.errorNameZonename').show();
    		error=true;
    	}
        if(!zoneimei.replace(/\s/g, '').length){
            var html = 'Enter an zoneimei';
            $('#zoneimei-error').addClass('error');
            $('#zoneimei-error').text(html);
            $('.errorNameZoneimei').show();
            error=true;
        }
    	if(!error){
            showPreloader();
            var url=$rootScope.baseUrl+ '/api/Zones/createZone';
            var zone = {
                zoneName : zonename,
                imeiNumber : zoneimei,
                siteId:selectedSite
            }
            $http({
                method: 'POST',
                url: url,
                data:zone
            }).then(function successCallback(response) {
                console.log(response);
                if(response.data.returnStatus=="SUCCESS"){
                    $('#createZoneModal').closeModal();
                    Materialize.toast('Zone added',2000);
                    $scope.getZonesList(selectedSite);
                }else {
                    $('#createZoneModal').closeModal();
                    Materialize.toast('Error occured, please refresh the page',2000);
                    hidePreloader();
                }
            },function errorCallback(response) {
                Materialize.toast('Error occured, please refresh the page',2000);
                hidePreloader();
            });
    	}
    };
    $scope.inputFocused = function(){
    	$('.errorName').hide();
    };
    $scope.getSitesList();
}]);