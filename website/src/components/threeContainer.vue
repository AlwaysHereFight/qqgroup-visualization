
<style scoped>

    #imgCanvas {
        display: none;
        border: solid 1px black;
    }

    .outDiv {
        position: fixed;
        width: 100%;
        height: 100%;       
    }

    .console {
        position: fixed;
        top: 20px;
        left: 20px;
        widows: 240px;
        height: 100px;
        padding: 10px;
        border: solid 1px black;
    }

    #threeContainer {
        width: 100%;
        height: 100%;
    }
</style>

<template>
    <div class="outDiv">
        <canvas id="imgCanvas" width="1280" height="640"></canvas>
        <div class="console">
            <Input
                v-model="searchNum"
                :placeholder="searchPlaceholder">
                <Select v-model="searchType" slot="prepend" style="width: 80px">
                    <Option value="qq">QQ号</Option>
                    <Option value="group">群号</Option>
                    <Option value="qqext">二层查</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="handleSearchBtnClick"></Button>
            </Input>
        </div>
        <div id="threeContainer">
        </div>
    </div>
</template>

<script>
    import * as THREE from "three";
    import OrbitControls from "three-orbitcontrols";

    export default {
        name: "threeContainer",
        data () {
            return {
                scene: null,
                camera: null,
                render: null,


                searchNum: "",
                searchType: "qqext",

                //接收接口返回的关系数据
                interfaceData: {
                    group: [],
                    member: [],
                    link: [],           
                },

                //全局关系图数据
                graphData: {
                    group: [],
                    member: [],
                    link: [],  
                },
            }
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
        watch: {

            searchType () {
                this.searchNum = null;
            },

            interfaceData (val, old) {
                //新增加的群成员节点
                let newMember = val.member.filter(iItem => !this.graphData.member.some(gItem => gItem.memberQQNum == iItem.memberQQNum));
                
                //新增加的群组节点
                let newGroup = val.group.filter(iItem => !this.graphData.group.some(gItem => gItem.groupNum == iItem.groupNum));
                
                //新增加的连接关系
                let newLink = val.link.filter(iItem => !this.graphData.link.some(gItem => {
                    return gItem.memberQQNum == iItem.memberQQNum && gItem.groupNum == iItem.groupNum;
                }));

                console.log(newMember);
                console.log(newGroup);
                console.log(newLink);

                this.graphData.member = this.graphData.member.concat(newMember);
                this.graphData.group = this.graphData.group.concat(newGroup);
                this.graphData.link = this.graphData.link.concat(newLink);
            },


            graphData (val, old) {
                // console.log(val);
                // console.log(old);
            }
        },
        methods: {

            //#region 页面事件
                handleSearchBtnClick () {
                    if (this.searchType == "qq") {

                    }
                    else if (this.searchType == "group") {

                    }
                    else if (this.searchType == "qqext") {
                        this.b_queryByQQNumExt();
                    }
                },
            //#endregion


            //#region 业务逻辑
                //根据QQ号进行查询
                async b_queryByQQNum () {
                    let qqNum = parseInt(this.searchNum);
                    if (!(qqNum !== qqNum)) {
                        let result = await this.$api.queryByQQNum(qqNum);
                        if (result.code == 200) {
                            this.interfaceData = result.data;
                        }
                    }
                    else {
                        this.$Message.warning("QQ号输入非法，请重新输入");
                        this.searchNum = "";
                    }
                },

                //根据群号进行查询
                async b_queryByGroupNum () {
                    let groupNum = parseInt(this.searchNum);
                    if (!(groupNum !== groupNum)) {
                        let result = await this.$api.queryByGroupNum(groupNum);
                        if (result.code == 200) {
                            this.interfaceData = result.data;
                        }
                    }
                    else {
                        this.$Message.warning("群号输入非法，请重新输入");
                        this.searchNum = "";
                    }
                },

                //根据QQ号进行二层查询
                async b_queryByQQNumExt () {
                    let qqNum = parseInt(this.searchNum);
                    if (!(qqNum !== qqNum)) {
                        let result = await this.$api.queryByQQNumExt(qqNum);
                        if (result.code == 200) {
                            this.interfaceData = result.data;
                        }
                    }
                    else {
                        this.$Message.warning("QQ号输入非法，请重新输入");
                        this.searchNum = "";
                    }
                },
            //#endregion


            createScene () {
                return new THREE.Scene();
            },
            createCamera () {
                let camera = null;
                camera = new THREE.PerspectiveCamera(45, this.$el.clientWidth / this.$el.clientHeight, 0.1, 1000);
                camera.position.x = 0;
                camera.position.y = 0;
                camera.position.z = 500;
                return camera;
            },
            createRender () {
                let render = null;
                render = new THREE.WebGLRenderer();
                render.setClearColor(0xf0f0f0);
                render.gammaInput = true;
                render.gammaOutput = true;
                render.shadowMap.enabled = true;
                render.shadowMapType = THREE.PCFSoftShadowMap;
                return render;
            },


            async createQQBall (qqNum) {
            },

            createGroupBall (groupNum) {

            },

            async createSphere () {
                let img = await this.$api.getGroupImg(594410203);
                let cvs = this.$el.querySelector("#imgCanvas");
                let ctx = cvs.getContext("2d");
                ctx.drawImage(img, 0, 0, cvs.width / 2, cvs.height);
                ctx.drawImage(img, cvs.width / 2, 0, cvs.width / 2, cvs.height);

                let texture = new THREE.Texture(cvs);
                let sphereGeometry = new THREE.SphereGeometry(5);
                let sphereMaterial = new THREE.MeshStandardMaterial({
                    color: "white",
                    roughness: 0,
                    metalness: 0,
                    map: texture
                });
                texture.needsUpdate = true;

                let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(0, 0, 0);
                sphere.castShadow = true;
                return sphere;
            },

            //创建面板平面
            createPlane () {
                let planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
                let planeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x333333
                });
                let plane = new THREE.Mesh(planeGeometry, planeMaterial);
                //设置平面角度
                plane.rotation.x = -0.5 * Math.PI;
                plane.position.set(0, -1, 0);
                plane.receiveShadow = true;
                plane.shadowDarkness = 0.9;
                return plane;
            },

            async addGeometry (scene) {
                //添加坐标系
                let axes = new THREE.AxesHelper(10000);
                this.scene.add(axes);

                //在底部添加一个平面
                // let plane = this.createPlane();
                // this.scene.add(plane);
                //添加一个立方体
                // cube = createCube();
                // scene.add(cube);
                // 添加一个球体
                let sphere = await this.createSphere();
                this.scene.add(sphere);

                //添加直线光源
                let spotLight = new THREE.SpotLight(0xffffff);
                spotLight.position.set(-100, 200, -100);
                spotLight.castShadow = true;
                spotLight.shadowMapHeight = 1024;
                spotLight.shadowMapWidth = 1024;
                this.scene.add(spotLight);

                // let ambientLight = new THREE.AmbientLight(0xffffff);
                // scene.add(ambientLight);

                let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.6);
                hemisphereLight.position.set(0, 200, 0);
                this.scene.add(hemisphereLight);
            },

            onWindowResize () {
                let width = this.$el.clientWidth;
                let height = this.$el.clientHeight;
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
                this.render.setSize(width, height);
            },

            animate () {      
                requestAnimationFrame(this.animate);
                this.render.render(this.scene, this.camera);
            },
        },
        async mounted () {
            this.scene = this.createScene();
            this.camera = this.createCamera();
            this.camera.lookAt(this.scene.position);
            this.render = this.createRender();

            await this.addGeometry();

            this.$el.querySelector("#threeContainer").appendChild(this.render.domElement);

            //配置轨道控制器
            let orbitControls = new OrbitControls(this.camera, this.render.domElement);
            //let orbitControls = new OrbitControls(camera, asciiRender.domElement);
            orbitControls.enableDamping = true;
            orbitControls.dampingFactor = 0.25;
            orbitControls.enableZoom = true;
            orbitControls.autoRotate = true;


            this.render.setSize(this.$el.clientWidth, this.$el.clientHeight);
            window.addEventListener("resize", this.onWindowResize, false);
            this.animate();
        }
    };
</script>

