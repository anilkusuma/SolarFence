module.exports = function(ZoneStatus) {
    var customLib = require('../../server/customlib.js');
    var app = require('../../server/server.js');
	ZoneStatus.getStatusOfSites = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                ZoneStatus.find({'where':{'siteId':req.query.siteId},'include':'zone','order':'createdOn DESC'},function(err,instance){
                	if(err){
                		var result ={};
                        console.log('error value is '+err);
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
    ZoneStatus.remoteMethod(
        'getStatusOfSites',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/getStatusOfSites',verb:'get'}
        }
    );

    ZoneStatus.getStatusOfZone = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                ZoneStatus.find({'where':{'and':[{'siteId':req.query.siteId},{'zoneId':req.query.zoneId}]},'include':'zone','order':'createdOn DESC','limit':'1'},function(err,instance){
                	if(err){
                		var result ={};
                        console.log('error value is '+err);
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
    ZoneStatus.remoteMethod(
        'getStatusOfZone',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/getStatusOfZone',verb:'get'}
        }
    );

    ZoneStatus.saveStatusOfZone = function(req,res,next){
        customLib.validateCookies(req,function(validated,user){
            if(validated){
                var user = JSON.parse(user);
                var userID = user.loginId
                var userType = user.login[0].userType;
                var zoneStatus = {};
		        zoneStatus.zoneId = req.body.zoneId;
                zoneStatus.siteId = req.body.siteId;
                zoneStatus.fenceStatus = req.body.fenceStatus;
                zoneStatus.lightStatus = req.body.lightStatus;
                zoneStatus.alarmStatus = req.body.alarmStatus;
                zoneStatus.acStatus = req.body.acStatus;
                zoneStatus.fenceOut = req.body.fenceOut;
                zoneStatus.fenceRet = req.body.fenceRet;
                zoneStatus.batteryVoltage = req.body.batteryVoltage;
                zoneStatus.spVoltage = req.body.spVoltage;

                app.models.UserCommands.create(zoneStatus,function(err,instance){
                	if(err){
                        console.log('error is '+err);
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

    ZoneStatus.remoteMethod(
        'saveStatusOfZone',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/saveStatusOfZone',verb:'post'}
        }
    );



    ZoneStatus.dataFromDevice = function(req,res,next){
        console.log('req body is '+JSON.stringify(req.body));
        var line_info = req.body.line_info;
        line_info = JSON.parse(line_info);
        var zoneImei = line_info.UId;
        var zoneStatus = {};

        zoneStatus.imeiNumber = zoneImei;
        zoneStatus.receivedPacketId = line_info.Plist[0].PktID;
        zoneStatus.fenceStatus = line_info.Plist[0].Fstat;
        zoneStatus.lightStatus = line_info.Plist[0].Lstat;
        zoneStatus.alarmStatus = line_info.Plist[0].Astat;
        zoneStatus.acStatus = line_info.Plist[0].ACstat;
        zoneStatus.fenceOut = line_info.Plist[0].FO;
        zoneStatus.fenceRet = line_info.Plist[0].FR;
        zoneStatus.batteryVoltage = line_info.Plist[0].BV;
        zoneStatus.spVoltage = line_info.Plist[0].SPV;

        console.log("packet recieved "+JSON.stringify(zoneStatus)+' zoneimei = '+zoneImei);

        var invalid = false;
        if(zoneImei == null || zoneImei == undefined){
            invalid = true;
        }
        if(zoneStatus.fenceStatus != "0" && zoneStatus.fenceStatus != "1"){
            invalid = true;
        }
        if(zoneStatus.lightStatus != "0" && zoneStatus.lightStatus != "1"){
            invalid = true;
        }
        if(zoneStatus.alarmStatus != "1" && zoneStatus.alarmStatus != "0"){
            invalid = true;
        }
        if(zoneStatus.acStatus != "1" && zoneStatus.acStatus != "0"){
            invalid = true;
        }

        if(zoneStatus.batteryVoltage == undefined || zoneStatus.batteryVoltage == null){
            invalid = true;
        }else if(zoneStatus.batteryVoltage.length>=50){
            invalid = true;
        }

        if(zoneStatus.fenceOut == undefined || zoneStatus.fenceOut == null){
            invalid = true;
        }else if(zoneStatus.fenceOut.length >= 50){
            invalid = true;
        }

        if(zoneStatus.fenceRet == undefined || zoneStatus.fenceRet == null){
            invalid = true;
        }else if(zoneStatus.fenceRet.length >= 50){
            invalid = true;
        }

        if(zoneStatus.spVoltage == undefined || zoneStatus.spVoltage == null){
            invalid = true;
        }else if(zoneStatus.spVoltage.length >= 50){
            invalid = true;
        }

        if(invalid){
            var result= "";
            result = '$'+zoneStatus.receivedPacketId+','+zoneStatus.fenceStatus+','+zoneStatus.lightStatus+','+zoneStatus.alarmStatus+'@';
            res.send(result);
            return;
        }
        app.models.Zones.find({'where':{'imeiNumber':zoneImei}},function(err,instance){
            if(err){
                console.log('ERROR in getting instance details ZONE');
                var result = "";
                console.log('ERROR101');
                result = '$'+zoneStatus.receivedPacketId+','+zoneStatus.fenceStatus+','+zoneStatus.lightStatus+','+zoneStatus.alarmStatus+'@';
                res.send(result);
                return;
            }else{
                if(instance.length == 0){
                    var result = "";
                    console.log('NOIMEINUMBER');
                    result = '$'+zoneStatus.receivedPacketId+','+zoneStatus.fenceStatus+','+zoneStatus.lightStatus+','+zoneStatus.alarmStatus+'@';
                    res.send(result);
                    return;
                }else{
                    zoneStatus.zoneId = instance[0].zoneId;
                    zoneStatus.siteId = instance[0].siteId;
                    ZoneStatus.create(zoneStatus,function(err,zonstatus){
                        if(err){
                            console.log('ERROR is '+err);
                            console.log('ERROR in getting instance details zoneStatus');
                            var result = "";
                            result = '$'+zoneStatus.receivedPacketId+','+zoneStatus.fenceStatus+','+zoneStatus.lightStatus+','+zoneStatus.alarmStatus+'@';
                            res.send(result);
                            return;
                        }else{
                            app.models.UserCommands.find({'where':{'zoneId':zoneStatus.zoneId},'order':'createdOn DESC','limit':'1'},function(err,usercommands){
                                if(err){
                                    console.log('ERROR in getting instance details UserCommands');
                                    var result = "";
                                    result = '$'+zoneStatus.receivedPacketId+','+zoneStatus.fenceStatus+','+zoneStatus.lightStatus+','+zoneStatus.alarmStatus+'@';
                                    return;
                                }else{
                                    if(usercommands.length!=0){
                                        var changed = false;
                                        if(usercommands[0].fenceStatus != zoneStatus.fenceStatus){
                                            changed = true;
                                        }else if(usercommands[0].lightStatus != zoneStatus.lightStatus){
                                            changed =true;
                                        }else if(usercommands[0].alarmStatus != zoneStatus.alarmStatus){
                                            changed = true;
                                        }else if(usercommands[0].acStatus != zoneStatus.acStatus){
                                            changed =true;
                                        }
                                        var result = "";
                                        console.log("SUCCESS "+zoneImei+' '+zonstatus.receivedPacketId);
                                        result = '$'+zoneStatus.receivedPacketId+','+usercommands[0].fenceStatus+','+usercommands[0].lightStatus+','+usercommands[0].alarmStatus+'@';
                                        res.send(result);
                                        return;
                                    }else{
                                        var result = {};
                                        console.log("No commands "+zoneImei+' '+zoneStatus.receivedPacketId);
                                        result = '$'+zoneStatus.receivedPacketId+','+zoneStatus.fenceStatus+','+zoneStatus.lightStatus+','+zoneStatus.alarmStatus+'@';
                                        res.send(result);
                                        return;
                                    }
                                }
                            });
                        }
                    });

                }
            }
        })
        
    };
    ZoneStatus.remoteMethod(
        'dataFromDevice',
        {
            isStatice:true,
            accepts:[
                { arg:'req' ,type:'object','http':{source:'req'}},
                { arg:'res' ,type:'object','http':{source:'res'}},
            ],
            http:{path:'/postDeviceData',verb:'post'}
        }
    ); 
};