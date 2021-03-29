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
            console.log("[vue:modal] mounted", this.imageId);
            this.getInfo();
        },
        methods: {
            close: function () {
                this.$emit("close");
            },
            getInfo: function () {
                console.log("[vue:modal] gettingo info", this.imageId);
                axios.get(`/images/${this.imageId}`).then((response) => {
                    this.image = response.data[0]; // oslanja se na Vue
                });
            },
        },
        watch: {
            imageId: function () {
                console.log("[vue:modal] imageId changed", this.imageId);
                this.getInfo();
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
                this.images = response.data; // oslanja se na Vue
                this.lastImageId = response.data[response.data.length - 1].id;
            });
            window.addEventListener("hashchange", () => {
                console.log("HASH", window.location.hash);
                console.log("HASH SLICE", window.location.hash.slice(1));
                console.log("LOCATION", window.location);
                console.log("[vue:main] hash changed", window.location.hash);
                this.currentImageId = window.location.hash.slice(1);
            });
            this.currentImageId = window.location.hash.slice(1);
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
