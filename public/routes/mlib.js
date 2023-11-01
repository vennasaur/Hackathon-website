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

router.get('/mlib',[checkAuthentication], function(req, res){
    res.render('formtemplate');
});


router.get('/madlib', [checkAuthentication], function(req, res){

	const {f_name,f_birthplace,f_friend,f_food,animalz} = req.query;
	// the above line is called destructuring.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring

	var params = {
		'name' : f_name,
		'place' : f_birthplace,
		'friend': f_friend,
		'food': f_food,
		'imag' : animalz
	}

    res.render('madlib', params);
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

module.exports = router;