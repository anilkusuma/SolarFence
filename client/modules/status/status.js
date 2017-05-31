app.controller('statusCtr', ['$http','$rootScope','$scope','$timeout','$location',function ($http,$rootScope,$scope,$timeout,$location) {
	$scope.timeoutVariables = [];
	$scope.zoneStatus= [];
	$timeout.cancel($rootScope.statusTimer);
	$timeout.cancel($rootScope.controlTimer);
	$scope.getLatestStatus = function(){
		var siteId = $rootScope.userDetails.siteId;
        showPreloader();
        console.log('site id is '+siteId);
        var url=$rootScope.baseUrl+ '/api/Zones/getAllZones?siteId='+siteId;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log(response);
            var data = JSON.stringify(response.data);
            data = JSON.parse(data);
            if(data.returnStatus == 'SUCCESS'){
				$scope.getLatestZoneData(data);
				hidePreloader();
			}
        },function errorCallback(response) {
            //callback('ERROR');
        });
	};

	$scope.getLatestZoneData = function(data){
		for(var i=0;i<data.responseData.length;i++){
			var zoneS = {};
			zoneS.zoneId = data.responseData[i].zoneId;
			zoneS.zoneName = data.responseData[i].zoneName;
			zoneS.siteId = $rootScope.userDetails.siteId;
			zoneS.fenceStatus = '';
			zoneS.lightStatus = '';
			zoneS.alarmStatus = '';
			zoneS.acStatus = '';
			zoneS.fenceOut = '';
			zoneS.fenceRet = '';
			zoneS.batteryVoltage = '';
			zoneS.spVoltage = '';
			$scope.zoneStatus.push(zoneS);
		}
		for(var j=0;j<$scope.zoneStatus.length;j++){
			$scope.updateZoneData(j);

		}
	}
	$scope.updateZoneData = function(id){
		var url=$rootScope.baseUrl+ '/api/ZoneStatuses/getStatusOfZone?siteId='+$scope.zoneStatus[id].siteId+"&zoneId="+$scope.zoneStatus[id].zoneId;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log(response);
            var data = JSON.stringify(response.data);
            data = JSON.parse(data);
            var zoneStatus = data.responseData[0];
            $scope.zoneStatus[id].fenceStatus = zoneStatus.fenceStatus;
			$scope.zoneStatus[id].lightStatus = zoneStatus.lightStatus;
			$scope.zoneStatus[id].alarmStatus = zoneStatus.alarmStatus;
			$scope.zoneStatus[id].acStatus = zoneStatus.acStatus;
			$scope.zoneStatus[id].fenceOut = zoneStatus.fenceOut;
			$scope.zoneStatus[id].fenceRet = zoneStatus.fenceRet;
			$scope.zoneStatus[id].batteryVoltage = zoneStatus.batteryVoltage;
			$scope.zoneStatus[id].spVoltage = zoneStatus.spVoltage;
			$rootScope.statusTimer = $timeout(function(){$scope.updateZoneData(id);},3000,false);
            console.log('zone status is '+JSON.stringify(zoneStatus));
        },function errorCallback(response) {
            //callback('ERROR');
            $rootScope.statusTimer = $timeout(function(){$scope.updateZoneData(id);},3000,false);
        });
	};
	$scope.zoneStatusClicked = function(status){
		console.log('zoneIsClicked'+status.zoneId);
		$location.path("/zoneControl/"+status.zoneId);
	};
	
	if($rootScope.userDetailsDone){
		$scope.getLatestStatus();
    }else{
        $scope.DetailDoneEvent = $scope.$on('DetailsDone',function(event,data){
                                    console.log('event receivied');
                                    $scope.getLatestStatus();
                                });
    }

}]);