const express = require("express");
const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.disable("x-powered-by");


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set("port", process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    res.render("home");
});


app.listen(app.get("port"), function(){
    console.log("Express working");
});