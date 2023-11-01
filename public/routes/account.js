const express = require('express');
const router = express.Router({strict: true});
var mysql = require('mysql');
var cookieParser = require('cookie-parser')

var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
}

var pool  = mysql.createPool(sql_params);


router.get('/loginout', function(req, res){
    if('authenticated' in req.session === false)
    {
    res.render('loginf');
    }
    else{
    
    delete req.session.authenticated;

    if('ccvisit_countdown' in req.session===true){
        delete req.session.ccvisit_countdown;
    }
    res.redirect("https://user.tjhsst.edu/2023mli1/")
    
    }
});


// router.get('/loging', function(req, res){

//     req.session.authenticated = true;
// 	const {user} = 'guest';
// 	// the above line is called destructuring.
// 	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring

// 	req.session.acc_user=user;
//     res.redirect("https://user.tjhsst.edu/2023mli1/")
// });

module.exports = router;