const express = require("express");
const app = express();
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const formidable = require('formidable');
const credentials = require('./credentials.js');
const fs = require('fs');

app.use(require('cookie-parser')(credentials.cookieSecret));

app.disable("x-powered-by");

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({
    extended: true
}));

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// Home page
app.get("/", function(req, res) {
    res.render("home");
});

// Other pages/routes
app.get("/about", function(req, res) {
    res.render("about"); // about.handlebars
});

app.use(function(err, req, res, next) {
    console.log('Error: ' + err.message);
    next();
});

app.get('/contact', function(req, res) {
    res.render('contact', { csrf: 'CSRF token here' });
});

app.post('/process', function(req, res) {
    console.log('Form ' + req.query.form);
    console.log('CSRF token ' + req.body._csrf);
    console.log('Email ' + req.body.email);
    console.log('Question ' + req.body.ques);
    res.redirect(303, '/thankyou');
});

app.post('/file-upload/:year/:month',
    function(req, res) {

        // Parse a file that was uploaded
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, file) {
            if (err)
                return res.redirect(303, '/error');
            console.log('Received File');

            // Output file information
            console.log(file);
            res.redirect(303, '/thankyou');
        });
    });

// Reading and writing to the file system
// Import the File System module : npm install --save fs


app.get('/readfile', function(req, res, next) {
    // Read the file provided and either return the contents
    // in data or an err
    fs.readFile('./public/randomfile.txt', function(err, data) {
        if (err) {
            return console.error(err);
        }
        res.send("The File : " + data.toString());
    });
});

// This writes and then reads from a file
app.get('/writefile', function(req, res, next) {
    // If the file doesn't exist it is created and then you add
    // the text provided in the 2nd parameter
    fs.writeFile('./public/randomfile2.txt',
        'More random text',
        function(err) {
            if (err) {
                return console.error(err);
            }
        });
    // Read the file like before
    fs.readFile('./public/randomfile2.txt', function(err, data) {
        if (err) {
            return console.error(err);
        }
        res.send("The File : " + data.toString());
    });
});

app.get('/thankyou', function(req, res) {
    res.render('thankyou');
});

app.use(function(req, res, next) {
    console.log("Looking for URL: " + req.url);
    next();
});

app.get('/file-upload', function(req, res) {
    var now = new Date();
    res.render('file-upload', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.use(function(req, res) {
    res.type('text/html');
    res.status(404);
    res.render("404");
});

app.use(function(req, res) {
    console.error(err.stack);
    res.status(500);
    res.render("500");
});

app.use('junk', function(req, res, next) {
    console.log("Tried to access /junk");
    throw new Error('/junk doesn\'t exist');
});

app.listen(app.get("port"), function() {
    console.log("Express working");
});