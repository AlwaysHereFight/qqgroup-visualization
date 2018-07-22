
<style scoped>

</style>

<template>
    <div>
        <Input
            v-model="searchNum"
            :placeholder="searchPlaceholder">
            <Select v-model="searchType" slot="prepend" style="width: 80px">
                <Option value="qq">QQ号</Option>
                <Option value="group">群号</Option>
                <Option v-if="this.type == 'graph'" value="qqext">二层查</Option>
            </Select>
            <Button slot="append" icon="ios-search" @click="handleSearchBtnClick"></Button>
        </Input>
    </div>
</template>

<script>
    export default {
        name: "search",
        props: {
            type: {
                type: String,
                default: "table",
            }
        },
        data () {
            return {
                searchNum: "",
                searchType: "",
            };
        },
        watch: {
            searchType (val, old) {
                if (val == "group" || old == "group") {
                    this.searchNum = "";
                }
            },
        },
        computed: {
            searchPlaceholder () {
                if (this.searchType == "qq") {
                    return "请输入QQ号";
                }
                else if (this.searchType == "group") {
                    return "请输入QQ群号";
                }
                else if (this.searchType == "qqext") {
                    return "请输入QQ号";
                }
                else {
                    return "";
                }
            }
        },
        methods: {
            handleSearchBtnClick () {
                alert(1);
            }
        },
        mounth () {
            if (this.type == "graph") {
                this.searchType = "qqext";
            }
            else {
                this.searchType = "qq";
            }
            this.searchNum = 10000;
        }
    };
</script>
