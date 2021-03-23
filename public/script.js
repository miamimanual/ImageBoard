(function () {
    new Vue({
        el: "#main",
        data: {
            title: "",
            description: "",
            username: "",
            images: [],
        },
        mounted: function () {
            axios.get("/images").then((response) => { 
                console.log(response);
                this.images = response.data;
            });
        },
        methods: {
            onSubmit: function () {
                const formData = new FormData();
                formData.append("file", file);
                axios.post("/upload", formData);
            },
        },
    });
})();

/*


