const numFactsL = [
    ["1 is neither prime nor composite","1 is the smallest positive integer","anything times 1 is still that number"],
    ["2 is the smallest prime number","2+2=4 and 2*2=4", "2 is the only even prime number"],
    ["3 is the smallest odd prime number","the number 3 is often used in myths","3 is the only prime number that comes before a square number"],
    ["4 is the smallest perfect square","4 is the 2nd smallest positive even number","4 is the number of limbs you have"]
    ];
const express = require('express');
const router = express.Router({strict: true});
var mysql = require('mysql');
var cookieParser = require('cookie-parser')
var https = require('https')


router.get('/:somepage',function(req, res){
    const {f_number,f_format} = req.query;
    var temp;
    if(req.params.somepage==1||req.params.somepage==2||req.params.somepage==3||req.params.somepage==4)
    {
        if(f_number==1)
        {
            temp=numFactsL[req.params.somepage-1].slice(0,1);
        }
        else if(f_number==2)
        {
            temp=numFactsL[req.params.somepage-1].slice(0,2);
        }
        else
        {
            temp=numFactsL[req.params.somepage-1];
        }
        
    }
    else
    {
        temp=["please use available integers (1-4) to display facts"];
    }
    var params = {
		'temp' : temp,
		'value' : req.params.somepage
	};
    if(f_format=='json')
    {
        res.json(params);
    }
    else
    {
        res.render('numFacts',params);
    }
});


module.exports = router;