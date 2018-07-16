
<style scoped>

</style>

<template>
    <div>
        <Layout>
            <Header>Header</Header>
            <Content>Content</Content>
        </Layout>
    </div>
</template>

<script>
    export default {
        name: "home",
        data () {
            return {

            };
        },
        async mounted () {
            await this.$api.queryByQQNum(10000);
        },
    };
</script>
