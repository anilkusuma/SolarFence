app.controller('siteCtr', ['$http','$rootScope','$scope','$timeout',function ($http,$rootScope,$scope,$timeout) {
    //hidePreloader();
    $timeout(function(){
        $('.tabsContainer .tabs a').removeClass('active');
        $('.tabsContainer .tabs .sites').addClass('active');
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
        			hidePreloader();
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
    $scope.deleteSite = function(site){
    	showPreloader();
    	var url=$rootScope.baseUrl+ '/api/Logins/deleteSite?siteId='+site.loginId;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
        	console.log(response);
        	if(response.data.returnStatus=="SUCCESS"){
        		Materialize.toast('Site deleted',2000);
        		$scope.getSitesList();
        	}else{
        		Materialize.toast('Error occured, please refresh the page',2000);
        		hidePreloader();
        	}
        },function errorCallback(response) {
            Materialize.toast('Error occured, please refresh the page',2000);
            hidePreloader();
        });
    };

    $scope.createSiteClicked = function(){
    	$scope.sitename = '';
    	$scope.password='';
    	$scope.confirmPassword = '';
    	$('#createSiteModal').openModal({dismissible:true},1);
    };
    $scope.createSite = function(){
    	var sitename = $scope.sitename;
    	var password = $scope.password;
    	var confirmPassword = $scope.confirmPassword;
    	var error=false;
    	if(!sitename.replace(/\s/g, '').length){
    		var html = 'Enter an sitename';
			$('#sitename-error').addClass('error');
    		$('#sitename-error').text(html);
    		$('.errorNameSitename').show();
    		error=true;
    	}
    	if(!error){
            $('#createSiteModal').closeModal();
            showPreloader();
            var url=$rootScope.baseUrl+ '/api/Sites/createSite?siteName='+sitename;
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                console.log(response);
                if(response.data.returnStatus=="SUCCESS"){
                    Materialize.toast('Site added',2000);
                    $scope.getSitesList();
                }else{
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