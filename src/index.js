require('dotenv').config()
const express = require("express");
const cors = require("cors");

const account = require("./route/account.route");
const post = require("./route/post.route");

const app = express();

// cors options
var corsOptions = {
    origin: `http://${process.env.URL}:${process.env.PORT}`,
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//ROUTES (add as many)
app.use("/account", account);
app.use("/post", post);
app.get("/", function (req, res) {
    res.send("<p>Hello there!</p>");
});


app.use(express.json())

//Listening to the server
app.listen(process.env.PORT, process.env.URL, function () {
    console.log(`🚀Server is running on Host: http://${process.env.URL}:${process.env.PORT}`);
});
