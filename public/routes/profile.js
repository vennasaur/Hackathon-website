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

var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
}

var pool  = mysql.createPool(sql_params);


router.get('/profile',[checkAuthentication,getUserName], function(req, res){
    
        //get items from sql
        //console.log(res.locals.profile)
        res.locals.ion_username = res.locals.profile.ion_username;
        //console.log(res.locals.ion_username)
        var sql2 = 'SELECT * FROM accounts WHERE id=?;';
    
    pool.query(sql2, [res.locals.ion_username], function(error, results, fields){
        if (error) throw error;
        //console.log(results)
        console.log(results[0].id)
        var params = {
        	'id' : results[0].id,
        	'full_name': results[0].full_name,
        	'nick' : results[0].nick,
        	'picture' : results[0].picture
        };
        res.render('profile',params)
    }) 
    
});

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

function getUserName(req,res,next) {
    if('authenticated' in req.session === false || 'access_token' in req.session.token === false)
    {
    return res.redirect("https://user.tjhsst.edu/2023mli1/");
    }
    var access_token = req.session.token.access_token;
    var profile_url = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;
    
    https.get(profile_url, function(response) {
    
      var rawData = '';
      response.on('data', function(chunk) {
          rawData += chunk;
      });
    
      response.on('end', function() {
        res.locals.profile = JSON.parse(rawData);
        next(); 
      });
    
    }).on('error', function(err) {
        next(err)
    });

}  


// router.get('/loging', function(req, res){

//     req.session.authenticated = true;
// 	const {user} = 'guest';
// 	// the above line is called destructuring.
// 	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring

// 	req.session.acc_user=user;
//     res.redirect("https://user.tjhsst.edu/2023mli1/")
// });

module.exports = router;