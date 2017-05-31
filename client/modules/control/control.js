app.controller('controlCtr', ['$http','$rootScope','$scope','$timeout','$routeParams',function ($http,$rootScope,$scope,$timeout,$routeParams) {
	showPreloader();
	$scope.zoneStatus = {};
    $timeout.cancel($rootScope.statusTimer);
    $timeout.cancel($rootScope.controlTimer);
	$scope.timer = '';
	$scope.getStatusOfZone = function(){
		//showPreloader();
		var zoneId= $routeParams.zoneId;
		var siteId = $rootScope.userDetails.siteId;
		var url=$rootScope.baseUrl+ '/api/ZoneStatuses/getStatusOfZone?siteId='+siteId+"&zoneId="+zoneId;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log(response);
            var data = JSON.stringify(response.data);
            data = JSON.parse(data);
            var zoneStatus = data.responseData[0];
            $scope.zoneStatus.zoneId=zoneId;
            $scope.zoneStatus.siteId=siteId;
            $scope.zoneStatus.zoneName = zoneStatus.zone.zoneName;
            $scope.zoneStatus.fenceStatus = zoneStatus.fenceStatus;
			$scope.zoneStatus.lightStatus = zoneStatus.lightStatus;
			$scope.zoneStatus.alarmStatus = zoneStatus.alarmStatus;
			$scope.zoneStatus.acStatus = zoneStatus.acStatus;
			$scope.zoneStatus.fenceOut = zoneStatus.fenceOut;
			$scope.zoneStatus.fenceRet = zoneStatus.fenceRet;
			$scope.zoneStatus.batteryVoltage = zoneStatus.batteryVoltage;
			$scope.zoneStatus.spVoltage = zoneStatus.spVoltage;
			hidePreloader();
            $rootScope.controlTimer = $timeout($scope.getStatusOfZone,3000,false);
            console.log('zone status is '+JSON.stringify(zoneStatus));
        },function errorCallback(response) {
        	hidePreloader();
            $rootScope.controlTimer = $timeout($scope.getStatusOfZone,3000,false);
            //callback('ERROR');
        });
    };
    if($rootScope.userDetailsDone){
        $scope.getStatusOfZone();
    }else{
        $scope.DetailDoneEvent = $scope.$on('DetailsDone',function(event,data){
                                    console.log('event receivied');
                                    $scope.getStatusOfZone();
                                });
    }

    $scope.inputChanged = function(changedButton){
    	$timeout.cancel($scope.timer);
        $scope.timer = $timeout(function(){
        	var zoneStatus = $scope.zoneStatus;
        	var url=$rootScope.baseUrl+ '/api/ZoneStatuses/saveStatusOfZone';
	        $http({
	            method: 'POST',
	            url: url,
	            data:zoneStatus
	        }).then(function successCallback(response) {
	            console.log(response);
	            var data = JSON.stringify(response.data);
	            data = JSON.parse(data);
	            if(data.returnStatus=='SUCCESS'){
	            	Materialize.toast('Status updated successfully',2000);
	            }else{
	            	Materialize.toast('Status not updated',2000);
	            }
	        },function errorCallback(response) {
	        	Materialize.toast('Status not updated',2000);
	        });
        },500);

    }


}]);