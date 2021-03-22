const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const { getImages } = require("./db");

app.get("/", (request, response) => {
    response.send("Ciao");
});

app.get("/images", (request, response) => {
    getImages()
        .then((results) => {
            console.log(results);
            response.send({
                results,
            });
            return;
        })
        .catch((error) => {
            console.log("error", error);
            response.sendStatus(500);
        });
});

app.listen(process.env.PORT || 8080);
