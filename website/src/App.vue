
<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>

<template>
    <div id='app'>
        <home-page />
    </div>
</template>

<script>
    import homePage from "./pages/home";

    export default {
        name: 'App',
        components: {
            homePage
        }
    }
</script>
