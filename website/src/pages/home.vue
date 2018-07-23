
<style scoped>

</style>

<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "home",
        data () {
            return {

            };
        },
        mounted () {
            this.$router.push("/graph/qqext/10001");
        },
        components: {

        }
    };
</script>
