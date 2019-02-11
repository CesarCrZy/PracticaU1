var express = require("express");
var mongoose = require("mongoose");

var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var request = require("request");
var https = require('https');
var favicon = require("serve-favicon");
var Recaptcha = require("express-recaptcha").Recaptcha;

var passport = require("passport");

var routers = require("./routes");
var passportsetup = require("./passportsetup");
var app = express();

var recaptcha = new Recaptcha("6LfQs2cUAAAAAMfq-V8dzYYpMHYPcc7en2G0rfdG", "6LfQs2cUAAAAAPzKeyTdvjZ-84YwVpF_eTQIvMqW");


mongoose.connect("mongodb://mariachi:1998cesar@ds061385.mlab.com:61385/computerdb");
passportsetup();

app.set("port", process.env.PORT || 3000);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// catch 404 and forward to error handler 
  
app.use(cookieParser());
app.use(session({
    secret: "mariachion",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize({
    userProperty: "user"
}));
app.use(passport.session());



app.use(routers);

/*app.post("/captcha", function(req, res){
    if(req.body["g-recaptcha-response"] === undefined || req.body["g-recaptcha-response"] === "" ||req.body["g-recaptcha-response"] === null){
        return res.json({"responseError" : "Please select captcha first"});
    }
    var secretKey = "6LfQs2cUAAAAAPzKeyTdvjZ-84YwVpF_eTQIvMqW";

    var verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationURL,function(error,response,body) {
        body = JSON.parse(body);
    
        if(body.success !== undefined && !body.success) {
          return res.json({"responseError" : "Failed captcha verification"});
        }
        res.json({"responseSuccess" : "Sucess"});
      }); 
});

app.use(function(req, res, next) { 
    var err = new Error('Not Found'); err.status = 404; next(err); 
    });*/
app.listen(app.get("port"), () => {
    console.log("La aplicacion se esta corriendo en  el puerto " + app.get("port"));
});