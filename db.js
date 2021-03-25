const spicedPg = require("spiced-pg");

const database = process.env.DB || "imageboard";

function getDatabaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { username, password } = require("./secrets.json");
    return `postgres:${username}:${password}@localhost:5432/${database}`;
}

const db = spicedPg(getDatabaseURL());

function getImages() {
    return db.query("SELECT * FROM images").then((result) => result.rows);
}

function createImage({ url, title, description, username }) {
    return db
        .query(
            "INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING *",
            [url, title, description, username]
        )
        .then((result) => result.rows[0]);
}

function getImageById(imageId) {
    return db
        .query("SELECT * FROM images WHERE id=$1", [imageId])
        .then((result) => result.rows);
}

module.exports = {
    getImages,
    createImage,
    getImageById,
};
