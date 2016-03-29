var request = require('request')
var socks = require('socksv5');

var socksConfig = {
	proxyHost: 'localhost',
	proxyPort: 1080,
	auths: [ socks.auth.None() ]
};

request({
	url : "http://www.google.com",
	agent: new socks.HttpAgent(socksConfig)
}, function (err, response, body){
	if (err){
		console.error(err);
	}
	else {
		console.log("response: %s", response.statusCode);
	}
});