module.exports = function(Sites) {
    var customLib = require('../../server/customlib.js');
    var app = require('../../server/server.js');
	Sites.getAllSites = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                Sites.find({'include':'zones'},function(err,instance){
                	if(err){
                        console.log("error is "+err);
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
            }else{
                result = {};
                result.returnStatus="FAILED";
                res.send(result);
            }
        });
    };
    Sites.remoteMethod(
        'getAllSites',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/getAllSites',verb:'get'}
        }
    ); 

    Sites.getSiteDetails = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                Sites.find({'where':{'siteId':req.query.siteId},'include':'zone'},function(err,instance){
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
            }else{
                result = {};
                result.returnStatus="FAILED";
                res.send(result);
            }
        });
    };
    Sites.remoteMethod(
        'getSiteDetails',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/getSiteDetails',verb:'get'}
        }
    ); 

    Sites.createSite = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                var site = {};
                site.siteName = req.query.siteName;

                Sites.create(site,function(err,instance){
                	if(err){
                		var result ={};
                        console.log("error is "+err);
                		result.returnStatus="ERROR";
                		res.send(result);
                	}else{
                		var result={};
                		result.returnStatus="SUCCESS";
                		result.responseData = instance;
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
    Sites.remoteMethod(
        'createSite',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/createSite',verb:'get'}
        }
    );


    Sites.deleteSite = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
           		Sites.destroyById(req.query.siteId,function(err){
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
    Sites.remoteMethod(
        'deleteSite',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/deleteSite',verb:'get'}
        }
    );

    
};