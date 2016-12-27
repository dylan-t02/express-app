const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);

app.get("/", function(req, res) {
    res.send("Express works");
});

app.listen(app.get("port"), function(){
    console.log("Express working");
});