const express = require('express');
const router = express.Router({strict: true});
var mysql = require('mysql');

var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
}

var pool  = mysql.createPool(sql_params);


router.get('/fishy', function(req, res){
    
    var userid = req.query.userid;
    if(userid!=='EZu2KrvzNPxREgJGgDn4yCjaLUDnU48bUU8AcLb36JcbjeU49X3zJVTTy4hEtNbU')
    {
        res.json('wrong user id')
    }
    else{
     var sql = 'SELECT id,fvotes FROM fishy';
     //res.render('fishy')
    pool.query(sql,function(error,results,fields){
        if(error)throw error;
        
        var params = {
        'fa': results[0].fvotes,
        }
        res.render('fishy',params);
    })
    }
    
    
});

router.get("/fishyv", function(req,res){

    var id = req.query.id;
    var dir = req.query.dir;
    
    var sql;
    if(dir === '1')
    {
        sql = 'UPDATE fishy SET fvotes=fvotes+1 WHERE id= ?;';
    }
    else{
        sql = 'UPDATE fishy SET fvotes=fvotes-1 WHERE id= ?;'
    }
 //CHANGE   
    pool.query(sql, [id], function(error, results, fields){
        if (error) throw error;
        res.redirect('https://user.tjhsst.edu/2023mli1/fishy?userid=EZu2KrvzNPxREgJGgDn4yCjaLUDnU48bUU8AcLb36JcbjeU49X3zJVTTy4hEtNbU')
    }) 
    
    
});
module.exports = router;