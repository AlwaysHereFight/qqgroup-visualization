
<style scoped>
    .search {
        margin-top: 15px;
        margin-left: 6px;
        width: 320px;
    }

    .qqInfo {
        margin-top: 20px;
    }

    .qqImgBig {
        width: 64px;
        height: 64px;
    }

    .myLabel {
        margin-top: 10px;
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 18px;
    }
</style>

<style>
    .tableSearch .qqImgSmall {
        width: 32px;
        height: 32px;
        cursor: pointer;
    }
</style>

<template>
    <div class="tableSearch">
        <div class="search">
            <search type="table" @on-search="handleSearch"></search>
        </div>
        <template v-if="type == 'qqTable'">
            <div class="qqInfo">
                <img class="qqImgBig" :src="`http://www.91weixin.net/qqlogo/headimg_dl?dst_uin=${ this.searchNum }&spec=640`" />
                <div>
                    <iframe
                        width="100%"
                        height="60"
                        :src="`http://www.91weixin.net/qqinfo/fcg-bin/cgi_get_portrait.fcg?uins=${ this.searchNum }`" frameborder="0">
                    </iframe>
                </div>
            </div>
            <div class="myLabel">QQ加群信息</div>
            <Table
                border
                stripe
                :loading="loading"
                :columns="columns2"
                :data="data2">
            </Table> 
        </template>
        <template v-if="type == 'groupTable'">
            <div class="myLabel">群信息</div>
            <Table
                border
                stripe
                :loading="loading"
                :columns="columns1"
                :data="data1">
            </Table>
            <div class="myLabel">群成员信息</div>
            <Table
                border
                stripe
                :loading="loading"
                :columns="columns2"
                :data="data2">
            </Table> 
        </template>
    </div>
</template>

<script>
    import search from "../components/search";

    export default {
        name: "normalSearch",
        data () {
            return {
                type: "",
                searchNum: "",
                qqInfo: "",
                data1: [],
                data2: [],
                loading: false,
            };
        },
        computed: {
            columns1 () {
                return [
                    {
                        title: "群头像",
                        render: (h, params) => {
                            return h("img", {
                                attrs: {
                                    class: "qqImgSmall",
                                    src: `http://www.91weixin.net/grouplogo/gh/${ this.searchNum }/${ this.searchNum }/640/`
                                },
                                on: {
                                    click: () => {
                                        location.href = `/table/group/${ this.searchNum }`;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: "群号",
                        render: (h, params) => {
                            return h("a", {
                                attrs: {
                                    href: `/table/group/${ this.searchNum }`
                                },
                            }, this.searchNum);
                        }
                    },
                    {
                        title: "群名称",
                        key: "groupTitle",
                    },
                    {
                        title: "群创建日期",
                        key: "groupCreateDate",
                    },
                    {
                        title: "群类型ID",
                        key: "groupClass",
                    },
                    {
                        title: "群Mast",
                        key: "groupMast",
                    },
                    {
                        title: "群简介",
                        key: "groupSummary",
                    },
                ];
            },
            columns2 () {
                if (this.type == "qqTable") {
                    return [
                        {
                            title: "群头像",
                            render: (h, params) => {
                                return h("img", {
                                    attrs: {
                                        class: "qqImgSmall",
                                        src: `http://www.91weixin.net/grouplogo/gh/${ params.row.groupNum }/${ params.row.groupNum }/640/`
                                    },
                                    on: {
                                        click: () => {
                                            location.href = `/table/group/${ params.row.groupNum }`;
                                        }
                                    }
                                });
                            }
                        },
                        {
                            title: "群号",
                            render: (h, params) => {
                                return h("a", {
                                    attrs: {
                                        href: `/table/group/${ params.row.groupNum }`
                                    },
                                }, params.row.groupNum);
                            }
                        },
                        {
                            title: "群名称",
                            key: "groupTitle",
                        },
                        {
                            title: "群创建日期",
                            key: "groupCreateDate",
                        },
                        {
                            title: "群类型ID",
                            key: "groupClass",
                        },
                        {
                            title: "群Mast",
                            key: "groupMast",
                        },
                        {
                            title: "群简介",
                            key: "groupSummary",
                        },
                        {
                            title: "群内昵称",
                            key: "userGroupNick",
                        },
                        {
                            title: "群内年龄",
                            key: "userGroupAge",
                        },
                        {
                            title: "群内性别",
                            key: "userGroupGender",
                        },
                        {
                            title: "群内权限",
                            key: "userGroupAuth",
                        },
                    ];
                }
                else if (this.type == "groupTable") {
                    return [
                        {
                            title: "群员QQ头像",
                            render: (h, params) => {
                                return h("img", {
                                    attrs: {
                                        class: "qqImgSmall",
                                        src: `http://www.91weixin.net/qqlogo/headimg_dl?dst_uin=${ params.row.memberQQNum }&spec=640`
                                    },
                                    on: {
                                        click: () => {
                                            location.href = `/table/qq/${ params.row.memberQQNum }`;
                                        }
                                    }
                                });
                            }
                        },
                        {
                            title: "群员QQ号",
                            render: (h, params) => {
                                return h("a", {
                                    attrs: {
                                        href: `/table/qq/${ params.row.memberQQNum }`
                                    }
                                }, params.row.memberQQNum);
                            }
                        },
                        {
                            title: "群员昵称",
                            key: "memberNick",
                        },
                        {
                            title: "群员年龄",
                            key: "memberAge",
                        },
                        {
                            title: "群员性别",
                            key: "memberGender",
                        },
                        {
                            title: "群员权限",
                            key: "memberAuth",
                        },
                    ];
                }
            }
        },
        methods: {
            handleSearch (searchObj) {
                let searchType = searchObj.searchType;
                let searchNum = searchObj.searchNum;

                searchNum = parseInt(searchNum);
                if (searchNum !== searchNum) {
                    this.$Message.warning("查询QQ号格式错误");
                    return;
                }

                if (searchType == "qq") {
                    location.assign(`/table/qq/${ searchNum }`);
                }
                else if (searchType == "group") {
                    location.assign(`/table/group/${ searchNum }`);
                }
            }
        },
        async mounted () {
            this.type = this.$route.name;
            this.searchNum = Number(this.$route.params.num);
            if (this.type == "qqTable") {
                this.loading = true;
                let result = await this.$api.queryTableByQQNum(this.searchNum);
                this.loading = false;
                if (result) {
                    this.data2 = result.data;
                }
            }
            else if (this.type == "groupTable") {
                this.loading = true;
                let result = await this.$api.queryTableByGroupNum(this.searchNum);
                this.loading = false;
                if (result) {
                    this.data1 = result.data.group;
                    this.data2 = result.data.member;
                }
            }
        },
        components: {
            search
        }
    };
</script>
