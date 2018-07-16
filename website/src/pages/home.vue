
<style scoped>

</style>

<template>
    <threeContainer />
</template>

<script>
    import threeContainer from "../components/threeContainer";

    export default {
        name: "home",
        data () {
            return {

            };
        },
        async mounted () {
            let data = await this.$api.queryByQQNum(10000);
            console.log(data);
        },
        components: {
            threeContainer
        }
    };
</script>
