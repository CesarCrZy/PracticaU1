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


mongoose.connect("mongodb://localhost:27017/computerDB");
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

app.listen(app.get("port"), () => {
    console.log("La aplicacion se esta corriendo en  el puerto " + app.get("port"));
});