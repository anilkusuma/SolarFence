module.exports = function(Zones) {
    var customLib = require('../../server/customlib.js');
    var app = require('../../server/server.js');
	Zones.getAllZones = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                Zones.find({'where':{'siteId':req.query.siteId},'include':'sites'},function(err,instance){
                	if(err){
                		var result ={};
                        console.log('error is '+err);
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
    Zones.remoteMethod(
        'getAllZones',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/getAllZones',verb:'get'}
        }
    ); 

    Zones.getZoneDetails = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                Zones.find({'where':{'and':[{'siteId':req.query.siteId},{'zoneId':req.query.zoneId}]},'include':'site'},function(err,instance){
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
    Zones.remoteMethod(
        'getZoneDetails',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/getZoneDetails',verb:'get'}
        }
    ); 

    Zones.createZone = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                var zone = {};
                zone.zoneName = req.body.zoneName;
                zone.siteId = req.body.siteId;
                zone.imeiNumber = req.body.imeiNumber;
                Zones.find({'where':{'imeiNumber':zone.imeiNumber}},function(err,zonedetails){
                    if(err){
                        var result ={};
                        result.returnStatus="ERROR";
                        res.send(result);
                    }else if(zonedetails.length != 0){
                        var result = {};
                        result.returnStatus = "DUPLICATE";
                        result.send(result);
                    }else{
                        Zones.create(zone,function(err,instance){
                            if(err){
                                var result ={};
                                result.returnStatus="ERROR";
                                res.send(result);
                            }else{
                                var result={};
                                result.returnStatus="SUCCESS";
                                result.responseData = instance;
                                //Zones.createZoneStatus(zone.siteId,instance.zoneId);
                                res.send(result);
                            }
                        });
                    }
                });
            }else{
                result = {};
                result.returnStatus="FAILED";
                res.send(result);
            }
        });
    };

    Zones.createZoneStatus = function(siteId,zoneId){
        var zoneStatus = {
            zoneId : zoneId,
            siteId : siteId,
            fenceStatus : 'Y',
            lightStatus : 'N',
            alarmStatus : 'N',
            acStatus    : 'Y',
            fenceOut    : '14.6 V',
            fenceRet    : '20.4 V',
            batteryVoltage  : '12.5 V',
            spVoltage       : '24.8 V'
        };
        app.models.ZoneStatus.create(zoneStatus,function(err,instance){
            if(err){
                console.log('Error value in status is '+err);
            }else{
                console.log('Created successfully');
            }
        });
    };

    Zones.remoteMethod(
        'createZone',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/createZone',verb:'post'}
        }
    );


    Zones.deleteZone = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
           		Zones.destroyById(req.query.zoneId,function(err){
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
    Zones.remoteMethod(
        'deleteZone',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/deleteZone',verb:'get'}
        }
    );
};