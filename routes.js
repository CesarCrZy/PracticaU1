var express = require("express");
var Compu = require("./models/computer");
var User = require("./models/user");

var https = require('https');
var Recaptcha = require("express-recaptcha").Recaptcha;

var acl = require("express-acl");

var passport = require("passport");

var router = express.Router();

//var recaptcha = new Recaptcha("6LfQs2cUAAAAAMfq-V8dzYYpMHYPcc7en2G0rfdG", "6LfQs2cUAAAAAPzKeyTdvjZ-84YwVpF_eTQIvMqW");


router.use((req, res, next) =>{
    res.locals.currentuser = req.user;
    res.locals.currentSong = req.song;

    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    
    if(req.user){
        req.session.role = req.user.role;
        res.locals.currentRole = req.user.role;
        //res.locals.roleinv = defaultRole;
    }
    if(req.session.role==undefined){
        acl.config({
            
            defaultRole:"invitado"
        });
        
    }else{
        
        acl.config({
            
            
            defaultRole: req.session.role 
        });
    }
    next();
});

router.use(acl.authorize);

router.get("/index", (req, res, next) => {
    Compu.find()
        .sort({  createdAt: "descending" })
        .exec((err, computers) => {
            if (err) {
                //return next(err);
            }
            res.render("index", { computers: computers });
        });

});

router.get("/", (req, res) => {
    res.render("pagina");
});


router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/videos", (req, res) => {
    res.render("videos");
});

router.post('/signup', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;
    var displayName = req.body.displayName;

    verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
        if (success) {
            //res.render("index");
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    return (err);
                }
                if (user) {
                    req.flash("error", "El nombre de usuario ya existe");
                    return res.redirect("/signup");
                }
                var newUser = new User({
                    username: username,
                    password: password,
                    role: role
                });
                newUser.save(next);
                return res.redirect("/");
            });
                // TODO: do registration using params in req.body
        } else {
            res.redirect("/signup");
                // TODO: take them back to the previous page
                // and for the love of everyone, restore their inputs
        }
});
});

var SECRET = "6LfQs2cUAAAAAPzKeyTdvjZ-84YwVpF_eTQIvMqW";

// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
                var data = "";
                res.on('data', function (chunk) {
                        data += chunk.toString();
                });
                res.on('end', function() {
                        try {
                                var parsedData = JSON.parse(data);
                                callback(parsedData.success);
                        } catch (e) {
                                callback(false);
                        }
                });
        });
}

/*router.post("/signup", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return (err);
        }
        if (user) {
            req.flash("error", "El nombre de usuario ya existe");
            return res.redirect("/signup");
        }
        var newUser = new User({
            username: username,
            password: password,
            role: role 
        });
        newUser.save(next);
        return res.redirect("/");
    });
});*/
router.get("/users", (req, res, next) => {
    User.find()
        .sort({  createdAt: "descending" })
        .exec((err, users) => {
            if (err) {
                //return next(err);
            }
            res.render("users", { users: users });
        });

});

router.get("/computers/:song", (req, res, next) => {
    Compu.findOne({ song: req.params.song }, (err, artist) => {
        if (err) {
            return next(err);
        }
        if (!artist) {
            return (404);
        }
        res.render("song", { artist: artist });
    });
});





router.get("/users1/:username", (req, res, next) => {
    User.findOne({ username: req.params.username }, (err, usern) => {
        if (err) {
            return next(err);
        }
        if (!usern) {
            return (404);
        }
        res.render("users1", { usern: usern });
    });
});
router.get("/login", function (req, res, next)  {
    res.render("login");
});

router.get("/ReSongs", (req, res) => {
    res.render("ReSongs");
});

router.post("/ReSongs", (req, res, next) => {
    var nameArtist = req.body.nameArtist;
    var song = req.body.song;
    var fecha = req.body.fecha;
    var user = req.user.username;
    var link = req.body.link;
    function getId(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
    
        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }
    
    var videoId = getId(link);
    

    Compu.findOne({ song: song }, (err, lu) => {
        if (err) {
            return (err);
        }
        if (lu) {
            req.flash("error", "This song is in the db");
            return res.redirect("/ReSongs");
        }
        var newSong = new Compu({
            nameArtist: nameArtist,
            song: song,
            fecha: fecha,
            user: user,
            link: videoId
        });
        newSong.save(next);
        return res.redirect("/index");
    });
});
router.get("/search", (req, res) => {
    res.render("search");
});

router.post("/search", (req, res, next) => {
    var search = req.body.search;

   
    Compu.find({ nameArtist: search }, (err, lu) => {
        if (err) {
            return (err);
        }
        if (lu) {
            return res.render("search", {lu: lu});
            //return res.send(lu);
        }
        
        
    });
});

router.post("/login", passport.authenticate("login", {
    
    successRedirect: "/index",
    failureRedirect: "/login",
    failureFlash: true
}));



router.get("/logout", (req, res) => {
    req.session.role = "invitado";
    req.logout();
    res.redirect("/");
});

router.get("/edit", ensureAuthenticated, (req, res) => {
    res.render("edit");
})

router.post("/edit", ensureAuthenticated, (req, res, next) => {
    req.user.username = req.body.username;
    req.user.bio = req.body.bio;
    req.user.save((err) => {
        if(err) {
            next(err);
            return;
        }
        req.flash("info", "Perfil actualizado!");
        res.redirect("/edit");
    });
});

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    }else {
        req.flash("info", "Necesitas iniciar sesion para poder ver esta seccion");
        res.redirect("/login")
    }
}
module.exports = router;