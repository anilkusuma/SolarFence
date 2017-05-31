app.controller('userCtr', ['$http','$rootScope','$scope','$timeout',function ($http,$rootScope,$scope,$timeout) {
    //hidePreloader();
    $timeout(function(){
        $('.tabsContainer .tabs a').removeClass('active');
        $('.tabsContainer .tabs .users').addClass('active');
    },0,false);
    $scope.getSitesList = function(callback){
        showPreloader();
        var url=$rootScope.baseUrl+ '/api/Sites/getAllSites';
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log(response);
            var data = JSON.stringify(response.data);
            data = JSON.parse(data);
            callback("SUCCESS",data);
        },function errorCallback(response) {
            callback('ERROR');
        });
    };

    $scope.getUsersList = function(){
    	showPreloader();
        var url=$rootScope.baseUrl+ '/api/Logins/getAllUsersForAdmin';
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
        	console.log(response);
        	if(response.data.returnStatus=="SUCCESS"){
        		if(response.data.responseData.length!=0){
        			var users = JSON.stringify(response.data.responseData);
        			users = JSON.parse(users);
        			console.log(users);
        			$scope.users=[];
        			$scope.users = users;
        			hidePreloader();
        		}else{
        			Materialize.toast('No users present,Please add a user',2000);
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
    $scope.deleteUser = function(user){
    	showPreloader();
    	var url=$rootScope.baseUrl+ '/api/Logins/deleteUser?userId='+user.loginId;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
        	console.log(response);
        	if(response.data.returnStatus=="SUCCESS"){
        		Materialize.toast('User deleted',2000);
        		$scope.getUsersList();
        	}else{
        		Materialize.toast('Error occured, please refresh the page',2000);
        		hidePreloader();
        	}
        },function errorCallback(response) {
            Materialize.toast('Error occured, please refresh the page',2000);
            hidePreloader();
        });
    }

    $scope.createUserClicked = function(){
        showPreloader();
    	$scope.username = '';
    	$scope.password='';
    	$scope.confirmPassword = '';
        $scope.sites = [];
        $scope.selectedSiteId = '';
        $scope.getSitesList(function(status,data){
            hidePreloader();
            console.log('status and data is '+status+' '+JSON.stringify(data));
            if(status=='ERROR'){
                Materialize.toast('Error occured, please refresh the page',2000);
            }else{
                if(data.returnStatus == "SUCCESS"){
                    if(data.responseData.length!=0){
                        var sites = JSON.stringify(data.responseData);
                        sites = JSON.parse(sites);
                        $scope.sites = sites;
                        $scope.selectedSiteId = sites[0];
                        console.log('inside open model');
                        $('#createUserModal').openModal({dismissible:true},1);
                        $timeout(function () { 
                          $('select').material_select();
                        }, 0, false);
                    }else{
                        Materialize.toast('No sites added,Please add a site to add user',2000);
                    }
                }else{
                    Materialize.toast('Error occured, please refresh the page',2000);
                }
            }
        })
    	
    }
    $scope.createUser = function(){

    	var username = $scope.username;
    	var password = $scope.password;
    	var confirmPassword = $scope.confirmPassword;
        if($scope.selectedSiteId.siteId == undefined){
            var selectedSiteId = $scope.selectedSiteId;
        }else{
            var selectedSiteId = $scope.selectedSiteId.siteId;
        }
    	var error=false;
    	if(!username.replace(/\s/g, '').length){
    		var html = 'Enter an username';
			$('#username-error').addClass('error');
    		$('#username-error').text(html);
    		$('.errorNameUsername').show();
    		error=true;
    	}
    	if(!password.replace(/\s/g, '').length){
    		var html = 'Password is mandatory';
			$('#password-error').addClass('error');
    		$('#password-error').text(html);
    		$('.errorNamePassword').show();
    		error=true;
    	}
    	if(!confirmPassword.replace(/\s/g, '').length){
    		var html = 'Confirm password is mandatory';
			$('#cp-error').addClass('error');
    		$('#cp-error').text(html);
    		$('.errorNameConfirmPassword').show();
    		error=true;
    	}
    	if(!error){
    		if(password!=confirmPassword){
    			var html = 'Password should match confirm password';
				$('#cp-error,#password-error').addClass('error');
	    		$('#cp-error,#password-error').text(html);
	    		$('.errorNameConfirmPassword,.errorNamePassword').show();
    		}else{
                console.log('selectedSiteId is '+JSON.stringify(selectedSiteId));
                //$('#createUserModal').closeModal();
                showPreloader();
                var url=$rootScope.baseUrl+ '/api/Logins/createUser';
                var data = {
                    'username':username,
                    'password':password,
                    'siteId':selectedSiteId
                }
                $http({
                    method: 'POST',
                    url: url,
                    data:data
                }).then(function successCallback(response) {
                    console.log(response);
                    if(response.data.returnStatus=="SUCCESS"){
                        Materialize.toast('User added',2000);
                        $('#createUserModal').closeModal();
                        $scope.getUsersList();
                    }else if(response.data.returnStatus == "ALREDYEXISTS"){
                        var html = 'User with same username exists for this site.';
                        $('#username-error').addClass('error');
                        $('#username-error').text(html);
                        $('.errorNameUsername').show();
                        hidePreloader();
                    }else{
                        Materialize.toast('Error occured, please refresh the page',2000);
                        $('#createUserModal').closeModal();
                        hidePreloader();
                    }
                },function errorCallback(response) {
                    Materialize.toast('Error occured, please refresh the page',2000);
                    $('#createUserModal').closeModal();
                    hidePreloader();
                });
    		}
    	}
    }
    $scope.inputFocused = function(){
    	$('.errorName').hide();
    }
    $scope.getUsersList();
}]);