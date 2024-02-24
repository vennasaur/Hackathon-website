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


router.get('/votes', [checkAuthentication],function(req, res){
    var sql = 'SELECT id,nvotes FROM votes';
    
    pool.query(sql,function(error,results,fields){
        if(error)throw error;
        
        var params = {
        'a': results[0].nvotes,
        'b': results[1].nvotes,
        'c': results[2].nvotes,
        'd': results[3].nvotes,
        'e': results[4].nvotes,
        }
        res.render('votes',params);
    })
    
    
    
});

router.get("/voted", [checkAuthentication],function(req,res){

    var id = req.query.id;
    var dir = req.query.dir;
    
    var sql;
    if(dir === '1')
    {
        sql = 'UPDATE votes SET nvotes=nvotes+1 WHERE id= ?;';
    }
    else{
        sql = 'UPDATE votes SET nvotes=nvotes-1 WHERE id= ?;'
    }
 //CHANGE   
    pool.query(sql, [id], function(error, results, fields){
        if (error) throw error;
        res.redirect('https://user.tjhsst.edu/2023mli1/votes')
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

module.exports = router;