(function () {
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
