const spicedPg = require("spiced-pg");
const database = process.env.DB || "imageboard";
const DEFAULT_LIMIT = 3;

function getDatabaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { username, password } = require("./secrets.json");
    return `postgres:${username}:${password}@localhost:5432/${database}`;
}

const db = spicedPg(getDatabaseURL());

function getImages({ last_id, limit }) {
    if (last_id) {
        return db
            .query(
                "SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT $2",
                [last_id, limit || DEFAULT_LIMIT]
            )
            .then((result) => result.rows);
    }
    return db
        .query("SELECT * FROM images ORDER BY id DESC LIMIT $1", [
            limit || DEFAULT_LIMIT,
        ])
        .then((result) => result.rows);
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
        .query("SELECT * FROM images WHERE id = $1", [imageId])
        .then((result) => result.rows);
}

function addCommentToImage({ username, imageId, text }) {
    return db
        .query(
            "INSERT INTO comments (username, image_id, text) VALUES ($1, $2, $3) RETURNING *",
            [username, imageId, text]
        )
        .then((result) => result.rows[0]);
}

function getCommentsByImageId(imageId) {
    return db
        .query(
            "SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC",
            [imageId]
        )
        .then((result) => result.rows);
}

module.exports = {
    getImages,
    createImage,
    getImageById,
    addCommentToImage,
    getCommentsByImageId,
};

/*
(SELECT MAX(id) FROM images WHERE id < $1) AS prev, 
(SELECT MIN(id) FROM images WHERE id > $1) AS next,

*/
