'use strict';
module.exports = function(server) {
  var customeLib = require('../customlib.js');
  var path = require('path');
  var router = server.loopback.Router();
  router.get('/',function(req,res){
      customeLib.validateCookies(req,function(validated,user){
        var user = JSON.parse(user);
        console.log('user validated '+validated);
        if(validated){
              var userID = user.loginId;
              var userType = user.login[0].userType;
              if(userType == 'USER'){
                  res.sendFile(path.resolve('../client/admin.html'));
              }else if(userType == 'ADMIN'){
                  res.sendFile(path.resolve('../client/admin.html'));
              }
        }else{
            res.sendFile(path.resolve('../client/login.html'));
        }
	    });
  });
//  router.get('*',function(req,res){
//      res.redirect('/');
//  });
  server.use(router);
};
