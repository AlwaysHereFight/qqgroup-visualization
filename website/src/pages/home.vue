
<style scoped>

</style>

<template>
    <router-view></router-view>
</template>

<script>
    import threeContainer from "../components/threeContainer";

    export default {
        name: "home",
        data () {
            return {

            };
        },
        mounted () {
            this.$router.push("/table/qq/10001");
        },
        components: {
            threeContainer
        }
    };
</script>
