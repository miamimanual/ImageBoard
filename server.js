const express = require("express");
const path = require("path");
const app = express();
const { uploader } = require("./upload");
const { getImages, createImage } = require("./db");

app.use(express.static(path.join(__dirname, "public")));

app.get("/images", (request, response) => {
    getImages()
        .then((results) => {
            console.log(results);
            response.json(results);
            // return;
        })
        .catch((error) => {
            console.log("error", error);
            response.sendStatus(500);
        });
});

app.get("/upload", (request, response) => {
    response.send(`
    <form enctype="multipart/form-data" action="/upload" method="POST">
        <input type="file" accept="image/*" name="file" required>
        <button type="submit">Upload</button>
    </form>
    `);
});

app.post("/upload", uploader.single("file"), (request, response) => {
    console.log("upload successful", request.file);
    response.sendStatus(200);
});

app.listen(process.env.PORT || 8080);
