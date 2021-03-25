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
                console.log("THIS iMAGEid", this.imageId);
                console.log("THIS image", this.image);
                console.log("THIS image", this.images);
                console.log("response 0", response.data[0]);
                console.log("response", response.data);
            });
        },
        methods: {
            close: function () {
                this.$emit("close");
            },
        },
    });

    Vue.component("comments", {
        template: "comments",
        props: ["imageId"],
        data: 
    });

    Vue.component("detail", {
        template: "#detail",
        props: ["description"],
        data: function () {
            return {
                title: "TEST COMPONENT",
            };
        },
        methods: {
            onButtonClick: function () {
                this.$emit("click");
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
        },

        mounted: function () {
            setTimeout(() => {
                this.originalText = "This app is not so great actually.";
            }, 2000);
            axios.get("/images").then((response) => {
                console.log(response);
                this.images = response.data; // oslanja se na Vue
            });
        },
        methods: {
            updateDescription: function () {
                this.originalText = "This is app is not so great actually.";
            },
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
                    .then((response) => this.images.push(response.data)); // bilo je detail, to je bila greska
            },
            onFileSelect: function () {
                this.file = this.$refs.image.files[0]; //proveri sta je refs
                console.log("refs", $refs.image.files);
            },
            onClick: function (imageId) {
                this.currentImageId = imageId;
            },
            onClose: function () {
                this.currentImageId = null;
            },
        },
    });
})();

/*

 onSubmit: function () {
                const formData = new FormData();
                formData.append("file", file);
                axios.post("/upload", formData);
            },

*/
