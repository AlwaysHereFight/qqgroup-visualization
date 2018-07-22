
import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/pages/home'
import tableSearchPage from "@/pages/tableSearch";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: "/",
            name: "home",
            component: homePage
        },
        {
            path: "/table",
            name: "tableSearch",
            component: tableSearchPage,
        },
        {
            path: "/table/qq/:num",
            name: "qqTable",
            component: tableSearchPage,
        },
        {
            path: "/table/group/:num",
            name: "groupTable",
            component: tableSearchPage,
        },
    ],
    mode: "history",
})
