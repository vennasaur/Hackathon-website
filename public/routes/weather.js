// import statement
const express = require('express');
const router = express.Router({strict: true});
var mysql = require('mysql');
var cookieParser = require('cookie-parser')
var https = require('https')
const { AuthorizationCode } = require('simple-oauth2');

var ion_client_id = 'sj1YRPNqWdIaqctf2u0Qz2ns25Rblzr6hZFwA3zE'
var ion_client_secret = 'aWgmapKPLw7rJKFa3zaEGAk2koLeWZIkNSpY9wMASGmoNn6231BFjJLN018wYKuCxCCeOBFlDh7wjVG9IrjRRgCZZJQqQIjKvsBLCoWeRaC2bt0fZpKteC6aztDqEgmS'
var ion_redirect_uri = 'https://user.tjhsst.edu/2023mli1/oauthacc'


var client = new AuthorizationCode({
    client: {
        id: ion_client_id,
        secret: ion_client_secret
    },
    auth: {
        tokenHost: 'https://ion.tjhsst.edu/oauth/',
        authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
        tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
        
    }
});

var authorizationUri = client.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uri
});

var options = { 
			
	headers : {
		'User-Agent': 'request'
	}

}

router.get('/weatherForm', [checkAuthentication],function(req, res){
    res.render('weatherForm');
});


router.get('/weather', [checkAuthentication],

	function(req,res,next) {
	    
        const {lat,long} = req.query;
        res.locals.lat = lat;
        res.locals.long = long;
        res.locals.bool = false;
        // console.log(lat)
        // console.log(long)
		var url = 'https://api.weather.gov/points/'+lat+','+long;
		console.log(url)
		//var url = 'https://api.weather.gov/points/42.9356,-78.8692';
		//var url = "https://api.weather.gov/gridpoints/BUF/35,48/forecast/hourly"
		
		https.get(url, options, function(response) {

			var rawData = '';
			response.on('data', function(chunk) {
				rawData += chunk;
			});
			response.on('end', function() {
			 //   console.log('----------------------------')
			 //   console.log(JSON.parse(rawData))
			 //   console.log('----------------------------')
			 //console.log(JSON.parse(rawData).properties)
			 //console.log('----------------------------')
			 //console.log(JSON.parse(rawData).properties.forecast)
			 //console.log('----------------------------')
				
				if(JSON.parse(rawData).properties===undefined)
				{
				    res.json('please enter real coordinates')
				}
				else
				{
				    if(JSON.parse(rawData).properties.forecast!==undefined)
				    {
				        if(JSON.parse(rawData).properties.forecast !== null){
				        res.locals.url = JSON.parse(rawData).properties.forecast;
				        res.locals.bool = true;
				        }
				        else
				        {
				            res.json('please enter real coordinates')
				        }
				    }
				    else
				    {
				        console.log('forecast undefined')
				    }
				}
				// console.log(res.locals.url)
				// console.log('----------------------------')
				next();
			});
		}).on('error', function(e) {
			res.json('use correct coords')
		})

	},
	function(req,res,next)
	{
	    if(res.locals.bool===true)
	    {
		var dlutil;
		const chars = res.locals.url.split('');
		if(chars[4]!='s')
		{
		    res.locals.url = res.locals.url.substring(0,4)+'s'+res.locals.url.substring(4);    
		}
		https.get(res.locals.url, options, function(response) {

			rawData2 = '';
			response.on('data', function(chunk) {
				rawData2 += chunk;
			});
			response.on('end', function() {

				//console.log(rawData2)
				// the res.locals object (and all its subkeys) persist across middleware calls
				res.locals.something_useful = JSON.parse(rawData2).properties.periods;
				next();
			});

		}).on('error', function(e) {
			res.json('funct 2')
		})}
	},
	
	function(req,res) {
	 if(res.locals.bool===true){
	 if(res.locals.something_useful===undefined)
	 {
	     res.json('funct 3')
	 }
	 else{
	        var params = {
	            'long': res.locals.long,
	            'lat': res.locals.lat,
		'temp' : res.locals.something_useful,
	}
	 }
	 }
	  
		// console.log(res.locals.url.properties)
		//var something_useful = res.locals.something_useful;
		// console.log(something_useful.properties.periods[0].temperature+"° "+something_useful.properties.periods[0].temperatureUnit)
        //console.log(something_useful.periods)
        res.render('weather',params)
		//res.json(something_useful.properties.periods[0].temperature+"° "+something_useful.properties.periods[0].temperatureUnit)

	})
function checkAuthentication(req,res,next) {

    if ('authenticated' in req.session) {
        // the user has logged in
        next()
    }
    else {
        // the user has not logged in
        res.render('unverified', {'login_link' : authorizationUri})
    }
}
module.exports = router;