const express = require("express");
const path = require("path");
const app = express();
const { uploader } = require("./upload");
const {
    getImages,
    createImage,
    getImageById,
    addCommentToImage,
    getCommentsByImageId,
} = require("./db");
const { s3upload } = require("./s3");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.get("/images", (request, response) => {
    getImages()
        .then((results) => {
            //console.log(results);
            response.json(results);
            // return;
        })
        .catch((error) => {
            console.log("error", error);
            response.sendStatus(500);
        });
});

app.get("/images/:imageId/comments", (request, response) => {
    const { imageId } = request.params;
    getCommentsByImageId(imageId)
        .then((comments) => response.json(comments))
        .catch((error) => {
            console.log(
                "[imageboard:express] error getting image comment",
                error
            );
            response.sendStatus(500);
        });
});

app.post("/images/:imageId/comments", (request, response) => {
    const { imageId } = request.params;
    const { username } = request.body.username;
    const { text } = request.body.text;

    addCommentToImage({ username, imageId, text })
        .then((comment) => response.json(comment))
        .catch((error) => {
            console.log(
                "[imageboard:express] error adding image comment",
                error
            );
            response.sendStatus(500);
        });
});

app.post("/images", uploader.single("file"), s3upload, (request, response) => {
    const url = `https://s3.amazonaws.com/spicedling/${request.file.filename}`;
    createImage({ url, ...request.body }) // username: request.body.username; ...
        .then((image) => response.json(image))
        .catch((error) => {
            console.log("imageboard:express] error saving image", error);
            response.sendStatus(500);
        });
});

/*
app.get("/images/:imageId", (request, response) => {
    const imageId = request.body.imageId;
}); */

app.get("/images/:imageId", (request, response) => {
    const imageId = request.params.imageId;
    console.log("IMAGEID", request.params.imageId);
    console.log("body IMAGEID", request.body.imageId);
    console.log("request.body");
    console.log("request.params");

    getImageById(imageId)
        .then((result) => {
            response.json(result);
            console.log("IMAGEID", request.params.imageId);
        })
        .catch((error) => {
            console.log(
                "[imageboard:express] error getting image by id",
                error
            );
            response.sendStatus(500);
        });
});

app.listen(process.env.PORT || 8080);

/*
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
*/
