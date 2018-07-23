
import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/pages/home'
import tableSearchPage from "@/pages/tableSearch";
import graphSearchPage from "@/pages/graphSearch";

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

        {
            path: "/graph",
            name: "graph",
            component: graphSearchPage,
        },
        {
            path: "/graph/qqext/:num",
            name: "qqExtGraph",
            component: graphSearchPage,
        },
        {
            path: "/graph/qq/:num",
            name: "qqGraph",
            component: graphSearchPage,
        },
        {
            path: "/graph/group/:num",
            name: "groupGraph",
            component: graphSearchPage,
        },
    ],
    mode: "history",
})
