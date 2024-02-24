const express = require('express');
const router = express.Router({strict: true});
var mysql = require('mysql');
var cookieParser = require('cookie-parser')
var https = require('https')





router.get("/svgmap",function(req,res){
    //console.log(res.locals.profile.ion_username)

    res.render('zoom_state');
})



module.exports = router;