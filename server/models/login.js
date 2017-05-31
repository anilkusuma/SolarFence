module.exports = function(Login) {
    var customLib = require('../../server/customlib.js');
    var crypto = require('crypto');
    var app = require('../../server/server.js');
    var result = {};

    Login.authenticate = function(req,res,next){
        var password = req.query.password;
        password = crypto.createHash('sha1').update(password).digest('Hex');
        Login.find({where:{'and':[{'userName':req.query.userName},{'userPassword':password}]}},function(err,instance){
            if(instance.length!=0){
                result = instance[0].toJSON();
                var selector = customLib.getRandom(8);
                var validator = customLib.getRandom(8);
                validator = validator.toString();
                var loginId = instance[0].loginId;
                validator = crypto.createHash('sha1').update(validator).digest('Hex');
                app.models.Validator.create({'loginId':loginId,'selector':selector,'validator':validator},function(err,object){
                    if(err)
                    {
                        result.validator = err;
                        console.log('error values is'+err);
                        result.validatorStatus="FAILED";
                    }
                    else
                    {
                         result.validator = object;
                         result.validatorStatus="SUCCESS";
                    }
                    result.loginStatus = "SUCCESS";
                    res.send(result);
                });
            }else{
				result = {};
                result.loginStatus="FAILURE";
                result.validatorStatus = "FAILED";
                result.failureReason="COMBINATIONDOESNOTEXIST";
                res.send(result);
            }
        });
    };
    Login.remoteMethod(
        'authenticate',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/login',verb:'get'}
        }
    ); 
    
    Login.updatePassword = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
			if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId;
                var userType = user.login[0].userType;
                var password = req.query.oldPassword;
                password = crypto.createHash('sha1').update(password).digest('Hex');
                Login.find({where:{'and':[{'loginId':userID},{'userPassword':password}]}},function(err,instance){
                    if(instance.length!=0){
                        var newPassword = req.query.newPassword;
                        newPassword = crypto.createHash('sha1').update(newPassword).digest('Hex');
                        Login.updateAll({'loginId':userID},{'userPassword':newPassword},function(err,info){
                            if(err)
                            {
                                result = {};
                                result.returnStatus = 'ERROR';
                                console.log('error values is'+err);
                                res.send(result);
                            }
                            else if(info.count == 1)
                            {
                                result = {};
                                result.returnStatus = 'SUCCESS';
                                res.send(result);
                            }else{
                                result = {};
                                result.returnStatus = 'ERROR';
                                res.send(result);
                            }
                        });
                    }else{
                        result = {};
                        result.returnStatus="EMPTY";
                        res.send(result);
                    }
                });
            }else{
				result = {};
				result.loginStatus="FAILED";
				result.vehicleStatus = "FAILED";
				result.failureReason="COMBINATIONDOESNOTEXIST";
				res.send(result);
			}
        });
    };
    Login.remoteMethod(
        'updatePassword',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/bUpdatePassword',verb:'get'}
        }
    ); 

    Login.userDetails = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                var result = {};
                result.responseData = user.login[0];
                result.returnStatus = "SUCCESS";
                res.send(result);
                
            }else{
                result = {};
                result.returnStatus="FAILED";
                res.send(result);
            }
        });
    };
    Login.remoteMethod(
        'userDetails',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/userDetails',verb:'get'}
        }
    ); 


    Login.createUser = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                var user = {};
                
                console.log('req.body is '+JSON.stringify(req.body));
                user.userName = req.body.username;
                var password = req.body.password;
                password = crypto.createHash('sha1').update(password).digest('Hex');
                user.userPassword = password;
                user.userType = "USER";
                user.siteId = req.body.siteId;

                Login.find({'where':{'and':[{'userName':user.userName},{'userType':"USER"},{'siteId':user.siteId}]}},function(err,instance){
                    if(err){
                        var result ={};
                        result.returnStatus="ERROR";
                        res.send(result);
                    }else{
                        if(instance.length != 0){
                            var result = {};
                            result.returnStatus="ALREDYEXISTS";
                            res.send(result);
                        }else{
                            Login.create(user,function(err,instance){
                                if(err){
                                    var result ={};
                                    result.returnStatus="ERROR";
                                    res.send(result);
                                }else{
                                    var result={};
                                    result.returnStatus="SUCCESS";
                                    result.responseData = instance;
                                    res.send(result);
                                }
                            });
                        }
                    }
                });
            }else{
                result = {};
                result.returnStatus="FAILED";
                res.send(result);
            }
        });
    };
    Login.remoteMethod(
        'createUser',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/createUser',verb:'post'}
        }
    );


    Login.deleteUser = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                Login.destroyById(req.query.userId,function(err){
                    if(err){
                        var result ={};
                        result.returnStatus="ERROR";
                        res.send(result);
                    }else{
                        var result={};
                        result.returnStatus="SUCCESS";
                        res.send(result);
                    }
                });
            }else{
                result = {};
                result.returnStatus="FAILED";
                res.send(result);
            }
        });
    };
    Login.remoteMethod(
        'deleteUser',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/deleteUser',verb:'get'}
        }
    );

    Login.getAllUsersForAdmin = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                var result = {};
                if(userType=='ADMIN'){
                    Login.find({'where':{'userType':'USER'},'include':'site'},function(err,instance){
                        if(err){
                            var result ={};
                            result.returnStatus="ERROR";
                            res.send(result);
                        }else{
                            var result={};
                            result.responseData = instance;
                            result.returnStatus="SUCCESS";
                            res.send(result);
                        }
                    });
                }else{
                    var result={};
                    result.returnStatus="NOTADMIN";
                    res.send(result);
                }
            }else{
                result = {};
                result.returnStatus="FAILED";
                res.send(result);
            }
        });
    };
    Login.remoteMethod(
        'getAllUsersForAdmin',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/getAllUsersForAdmin',verb:'get'}
        }
    ); 

};