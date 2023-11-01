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


router.get("/esports",[checkAuthentication,getUserName],function(req,res){
    //console.log(res.locals.profile.ion_username)
    params = 
        {
                'nick' : res.locals.profile.ion_username,
        }
    res.render('esportspage',params);
})

router.get('/sql_ajax_get_player', function(req,res){
    
    var player_id;
    if ('player' in req.query === false) {
        return res.send('missing player by that Name')
    } else {
        player_id = req.query.player;
    }
    
    var sql = 'CALL showplayer(?);';
    pool.query(sql,[player_id],function(error, results, fields){

        res.render('tablemaker',{'results':results[0]})       
    
    })

})

router.get('/sql_ajax_get_team', function(req,res){
    
    var team_id;
    if ('team' in req.query === false) {
        return res.send('missing team with that Name')
    } else {
        team_id = req.query.team;
    }
    
    var sql = 'CALL showteam(?);';
    pool.query(sql,[team_id],function(error, results, fields){

        res.render('tablemaker',{'results':results[0]})        
    
    })

})

router.get('/sql_ajax_get_history', function(req,res){
    
    var player_id;
    var team_id;
    if ('player' in req.query === false) {
        return res.send('missing player by that Name')
    } else {
        player_id = req.query.player;
    }
    
    var sql = 'CALL showhistory(?);';
    pool.query(sql,[player_id],function(error, results, fields){

        res.render('playerhistorytable',{'results':results[0]})        
    
    })

})

router.get('/sql_ajax_add_player', function(req,res){
    
    var player_id;
    var team_id;
    var rank;
    if ('player' in req.query === false || 'team' in req.query === false || 'rank' in req.query === false) {
        return res.json('missing player,team ID, or rank ID')
    } else {
        player_id = req.query.player;
        team_id = req.query.team;
        rank=req.query.rank;
    }
    pool.query('CALL showplayer(?)',[player_id],function(error,results,fields){
        
        //console.log(results[0]);
        
        if(results[0].length===0)
        {
            var sql = 'CALL addplayer(?,?,?);';
            pool.query(sql,[team_id,player_id,rank],function(error, results, fields){
            res.json('Successful Integration');
            })
            
        }
        else{
            res.json('ERROR suck it: Player Name is already in use')
        }
        
        })
   

})

router.get('/sql_ajax_add_points',[checkAuthentication,getUserName], function(req,res){
    
    var player_id;
    var sender;
    var points;
    if ('player' in req.query === false|| 'points' in req.query === false) {
        return res.send('missing player or points query')
    } else {
        player_id = req.query.player;
        points= req.query.points;
        sender = res.locals.profile.ion_username;
    }
    
    var sql = 'CALL addpoints(?,?,?);';
    pool.query(sql,[sender,player_id,points],function(error, results, fields){

        res.json('Points Added');
    
    })

})

router.get('/sql_ajax_team_sum', function(req,res){
    
    var sql = 'CALL sumteam;';
    pool.query(sql,function(error, results, fields){

        res.render('sumteamtable',{'results':results[0]})        
    
    })
})

router.get('/sql_ajax_player_sum', function(req,res){
    
    var sql = 'CALL sumplayers;';
    pool.query(sql,function(error, results, fields){

        res.render('sumplayertable',{'results':results[0]})        
    
    })
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
function getUserName(req,res,next) {
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



module.exports = router;