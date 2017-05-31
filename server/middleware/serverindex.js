module.exports = serveindex;
var customeLib = require('../customlib.js');
var path = require('path');
function serveindex(){
  return function(req, res){
      customeLib.validateCookies(req,function(validated,user){
        console.log('server index user validated '+validated);
        var user = JSON.parse(user);
	  	if(validated){
            res.sendFile(path.resolve('../client/admin.html'));
		}else{
			res.sendFile(path.resolve('../client/login.html'));
		}
      });
//      res.redirect('/');
  }
}