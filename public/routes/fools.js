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

router.get('/fools',
function(req,res){

    var sql = 'UPDATE fools SET count=count+1;'
    
    pool.query(sql, function(error, results, fields){
        if (error) throw error;
        //res.redirect('https://www.youtube.com/watch?v=ZKuDJQqy6ak');// amongus
        //res.redirect('https://www.youtube.com/watch?v=2RtI5UEZlzU');//toad sings
        res.redirect('https://www.youtube.com/watch?v=jDwVkXVHIqg');//chandelier
        
    }) 
  
});
module.exports = router;