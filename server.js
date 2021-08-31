require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const shortid = require('shortid')
const app = express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

//set map for shortId and url 

const urlMap= new Map();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  
// res.redirect('http://google.com');
  var shortUrl=req.params.shorturl;
  if(Array.from(urlMap.values()).includes(parseInt(shortUrl))){
    var mainUrl=urlFromShort(parseInt(shortUrl));
    console.log("found ->"+mainUrl);
    res.redirect(mainUrl); 
  } else {
    res.json({
        error:"invalid short url"
      });
  }
});

app.post("/api/shorturl", (req,res)=>{
var input_url=req.body.url;
if(is_validu_rl(input_url)){
  var base_result = input_url.replace(/(^\w+:|^)\/\//, '');
  dns.lookup(base_result, function (err, addresses, family) {
    if(err){
      res.json({
        error:"invalid url"
      });
    } else{
      
      if(urlMap.has(input_url)){
        res.json({
          original_url:input_url,
          short_url:urlMap.get(input_url)
        });
      } else {
        var sId= getShortId();
        urlMap.set(input_url,sId);
        res.json({
          original_url:input_url,
          short_url:sId
        });
      }
    }
  });
} else {
  res.json({
      error:"invalid url"
    });
}
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function getShortId(){
  var isUnique=false;
  var new_shortId=00;
  while(!isUnique){
    var newNum=Math.floor((Math.random() * 100) + 1);
    if(!Array.from(urlMap.values()).includes(newNum)){
      isUnique=true;
      new_shortId=newNum;
    }
  }
  return new_shortId;
}

function  urlFromShort(short_key){
  var return_key="";
  for (let [k, v] of urlMap) {
      if (v === short_key) { 
        return k; 
      }
  }  
  return return_key;

}
function is_validu_rl(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str))
        {
          return true;
        }
        else
        {
          return false;
        }
}
