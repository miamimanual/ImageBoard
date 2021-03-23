(function () {
    new Vue({
        el: "#main",
        data: {
            title: "",
            description: "",
            username: "",
            file: null,
            images: [],
        },
        mounted: function () {
            axios.get("/images").then((response) => {
                console.log(response);
                this.images = response.data; // oslanja se na Vue
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
                    .then((response) => this.images.push(response.detail));
            },
            onFileSelect: function () {
                this.file = this.$refs.image.files[0];
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
