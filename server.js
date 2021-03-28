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
app.use(express.json());

app.get("/images", (request, response) => {
    getImages()
        .then((results) => {
            response.json(results);
        })
        .catch((error) => {
            console.log("error", error);
            response.sendStatus(500);
        });
});

app.get("/images/:imageId/comments", (request, response) => {
    const imageId = request.params.imageId;

    getCommentsByImageId(imageId)
        .then((comments) => {
            response.json(comments);
        })
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
    const { username } = request.body;
    const { text } = request.body;

    addCommentToImage({ imageId, username, text }) // ...request.body
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

app.get("/images/:imageId", (request, response) => {
    const imageId = request.params.imageId;

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
