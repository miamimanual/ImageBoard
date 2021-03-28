(function () {
    Vue.component("popup", {
        template: "#popup",
        props: ["imageId"], // ovo je ono sto potrazujemo, narucujemo u restoranu;
        data: function () {
            return {
                image: {}, // zasto su ove zagrade a ne []
            };
        },
        mounted: function () {
            console.log("THIS iMAGEid", this.imageId);
            console.log("THIS image", this.image);

            axios.get(`/images/${this.imageId}`).then((response) => {
                this.image = response.data[0]; // oslanja se na Vue
            });
        },
        methods: {
            close: function () {
                this.$emit("close");
            },
        },
    });

    Vue.component("comments", {
        template: "#comments",
        props: ["imageId"],
        data: function () {
            return {
                comments: [],
                username: "",
                text: "",
            };
        },
        mounted: function () {
            console.log("[vue:comments] getting image id:", this.imageId);
            axios.get(`/images/${this.imageId}/comments`).then((response) => {
                console.log("RESPONSE DATA", response.data);
                this.comments = response.data;
            });
        },
        methods: {
            onSubmit: function () {
                axios
                    .post(`/images/${this.imageId}/comments`, {
                        username: this.username,
                        text: this.text,
                        imageId: this.imageId,
                    })
                    .then((response) => {
                        this.comments.push(response.data);
                        this.username = "";
                        this.text = "";
                    });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            originalText: "It´s working",
            title: "",
            description: "",
            username: "",
            file: null,
            images: [],
            currentImageId: null, // why null
            lastImageId: null,
            IMG_LIMIT: 3,
            imagesAvailable: true,
        },

        mounted: function () {
            axios.get("/images").then((response) => {
                console.log("mounted RESPONSE DATA", response.data);
                console.log(
                    "mounted RESPONSE DATA LENGTH",
                    response.data.length
                );

                this.images = response.data; // oslanja se na Vue
                this.lastImageId = response.data[response.data.length - 1].id;
            });
            window.addEventListener("hashchange", () => {
                this.currentImageId = window.location.hash.slice(1);
                console.log("WINDOW LOCATION HASH", window.location.hash);
            });
        },
        methods: {
            onSubmit: function () {
                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/images", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then((response) => this.images.push(response.data));
            },
            onFileSelect: function () {
                this.file = this.$refs.image.files[0]; //proveri sta je refs
                /* console.log("refs", this.file); */
            },
            onClick: function (imageId) {
                this.currentImageId = imageId;
            },
            onClose: function () {
                this.currentImageId = null;
            },
            onMoreImagesClick: function () {
                this.getMoreImages();
            },
            getMoreImages: function () {
                axios
                    .get("/images", {
                        params: {
                            last_id: this.lastImageId,
                            limit: this.IMG_LIMIT,
                        },
                    })
                    .then((response) => {
                        console.log("RESPONSE", response);
                        console.log("RESPONSE DATA", response.data);
                        console.log(
                            "RESPONSE DATA LENGTH",
                            response.data.length
                        );
                        this.images = [...this.images, ...response.data];
                        this.lastImageId =
                            response.data[response.data.length - 1].id;

                        if (
                            response.data.length !== this.IMG_LIMIT ||
                            this.lastImageId === 1
                        ) {
                            this.imagesAvailable = false;
                        }
                    });
            },
        },
    });
})();
