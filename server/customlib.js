module.exports.isEmptyObject = function(obj) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return false;
        }
      }
      return true;   
 };
module.exports.getRandom = function(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1)); 
};

module.exports.validateCookies = function(req,callback){
	var app = require('./server.js');
	var customLib = require('./customlib.js');
    if(req.query.validator != undefined && req.query.selector != undefined && req.query.loginId != undefined){
		app.models.Validator.find({where:{'and':[{'validator':req.query.validator},{'selector':req.query.selector}]},include:'login'},function(err,instance){       			
			if(instance.length !== 0){
                if(instance[0].loginId == req.query.loginId){
				    callback(true,JSON.stringify(instance[0]));
			     }else{
				    callback(false,null);
			     }
            }
            else{
                callback(false,null);
            }
 		});
	}else if(!customLib.isEmptyObject(req.headers.cookie)){
		console.log('inside cookies ' );
    	var lists = req.headers.cookie.split("; ");
        var cookies = {};
        for(i=0;i<lists.length;i++){
        	var c = lists[i].split("=");
			cookies[c[0]] = c[1];
            if(c.length>=2)
            	cookies[c[0]] = c[1];
		}
		//console.log('selector validator '+JSON.stringify(cookies));
		app.models.Validator.find({where:{'and':[{'validator':cookies.validator},{'selector':cookies.selector}]},include:'login'},function(err,instance){       			
			if(instance.length !== 0){
                if(instance[0].loginId == cookies.userID){
				    callback(true,JSON.stringify(instance[0]));
			     }else{
				    callback(false,null);
			     }
            }
            else{
                callback(false,null);
            }
 		});
	} else{
		callback(false,null);
	}
};
module.exports.validateSelectors = function(validator,selector,userId,callback){
	var app = require('./server.js');
	var customLib = require('./customlib.js');
	app.models.VtsValidator.find({where:{'and':[{'validator':validator},{'selector':selector}]}},function(err,instance){ 
		if(instance.length !== 0){
			if(instance[0].userId == userId){
				callback(true);
			}
			else{
				callback(false);
			}
		}else{
			callback(false);
		}
	});
};
