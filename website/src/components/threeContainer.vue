
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
        top: 10px;
        left: 10px;
        widows: 240px;
        height: 100px;
        padding: 10px;
        background-color: white;
        border: solid 1px #e0e0e0;
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


                searchNum: "64022468",
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

            searchType (val, old) {
                if (val == "group" || old == "group") {
                    this.searchNum = "";
                }
            },

            async interfaceData (val, old) {
                let tmpInterfaceData = {
                    group: val.group.filter(iItem => !this.graphData.group.some(gItem => gItem.groupNum == iItem.groupNum)),
                    member: val.member.filter(iItem => !this.graphData.member.some(gItem => gItem.memberQQNum == iItem.memberQQNum)),
                    link: val.link.filter(iItem => !this.graphData.link.some(gItem => gItem.linkQQNum == iItem.linkQQNum && gItem.linkGroupNum == iItem.linkGroupNum)),
                };

                console.log("开始获取数据...");
                await this.b_fillInterfaceData(tmpInterfaceData);
                console.log("数据获取结束");
                console.log(tmpInterfaceData);


                
                let r = 50;
                let o = 0;
                let q = 0;

                function hd (num) {
                    return num * (2 * Math.PI / 360);
                }

                tmpInterfaceData.member.forEach((item, i) => {
                    let ball = this.t_createMemberBall(item);
                    let jd = i * 16;
                    ball.position.set(
                        r * Math.sin(hd(o)) * Math.cos(hd(q)),
                        r * Math.sin(hd(o)) * Math.sin(hd(q)),
                        r * Math.cos(hd(o)));
                    this.scene.add(ball);

                    o += 20;
                    if (o >= 360) {
                        o = 0;
                        q += 20;
                    }
                });

                // tmpInterfaceData.group.forEach((item, i) => {
                //     let ball = this.t_createGroupBall(item);
                //     ball.position.set((i % 10) * 14, (i / 10) * 14, 20);
                //     this.scene.add(ball);
                // });


                this.graphData.member = this.graphData.member.concat(tmpInterfaceData.member);
                this.graphData.group = this.graphData.group.concat(tmpInterfaceData.group);
                this.graphData.link = this.graphData.link.concat(tmpInterfaceData.link);
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
                        this.b_queryByQQNum();
                    }
                    else if (this.searchType == "group") {
                        this.b_queryByGroupNum();
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

                //批量获取用户QQ头像并填充到列表中
                b_fillQQImg (memberList) {
                    return new Promise((resolve, reject) => {
                        let count = 0;
                        if (memberList.length < 1) {
                            resolve();
                        }                      
                        memberList.forEach(async item => {
                            let img = await this.$api.getQQImg(item.memberQQNum);
                            item.img = img;
                            count++;
                            if (count >= memberList.length) {
                                resolve();
                            }
                        });
                    });
                },

                //批量获取群头像并填充到列表中
                b_fillGroupImg (groupList) {
                    return new Promise((resolve, reject) => {
                        let count = 0; 
                        if (groupList.length < 1) {
                            resolve();
                        }                          
                        groupList.forEach(async item => {
                            let img = await this.$api.getGroupImg(item.groupNum);
                            item.img = img;
                            count++;
                            if (count >= groupList.length) {
                                resolve();
                            }
                        });
                    });
                },

                //批量获取最新QQ账户信息并填充到列表中
                b_fillQQLastData (memberList) {
                    return new Promise((resolve, reject) => {
                        let count = 0;
                        if (memberList.length < 1) {
                            resolve();
                        }
                        memberList.forEach(async item => {
                            let info = await this.$api.getQQInfo(item.memberQQNum);
                            item.info = info;
                            count++;
                            if (count >= memberList.length) {
                                resolve();
                            }
                        });
                    });
                },

                //批量加工从接口返回的数据
                b_fillInterfaceData (interfaceData, timeout = 60000) {
                    return new Promise((resolve, reject) => {
                        let count = 0;

                        let timerId = setTimeout(() => {
                            reject();
                        }, timeout);

                        function tryFinish () {
                            if (count >= 3) {
                                clearInterval(timerId);
                                resolve();
                            }
                        }

                        (async () => {
                            await this.b_fillQQImg(interfaceData.member);
                            count++;
                            tryFinish();
                        })();
                        (async () => {
                            await this.b_fillGroupImg(interfaceData.group);
                            count++;
                            tryFinish();
                        })();
                        (async () => {
                            await this.b_fillQQLastData(interfaceData.member);
                            count++;
                            tryFinish();
                        })();
                    });
                },

                //创建用于绘图的Canvas,并清空
                b_createCanvas () {
                    let cvs = document.createElement("canvas");
                    cvs.width = 640 * 2;
                    cvs.height = 640;
                    let cvsCtx = cvs.getContext("2d");
                    cvsCtx.fillStyle = "#ffffff";
                    cvsCtx.fillRect(0, 0, cvs.width, cvs.height);
                    return cvs;
                },

                //绘制图片到准备好的Canvas上
                b_drawCanvas (cvs, img) {
                    let cvsCtx = cvs.getContext("2d");
                    cvsCtx.drawImage(img, 0, 0, cvs.width / 2, cvs.height);
                    cvsCtx.drawImage(img, cvs.width / 2, 0, cvs.width / 2, cvs.height);
                },
            //#endregion


            //#region Three对象创建
                createScene () {
                    return new THREE.Scene();
                },
                createCamera () {
                    let camera = null;
                    camera = new THREE.PerspectiveCamera(45, this.$el.clientWidth / this.$el.clientHeight, 0.1, 2000);
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


                t_createTexture (img) {
                    let canvas = document.createElement("canvas");
                    canvas.width = 640 * 2;
                    canvas.height = 640;
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height);
                    ctx.drawImage(img, canvas.width / 2, 0, canvas.width / 2, canvas.height);
                    let texture = new THREE.Texture(canvas);
                    canvas = null;
                    return texture;
                },

                //创建群成员3D对象
                t_createMemberBall (member) {
                    let texture = this.t_createTexture(member.img);
                    let sphereGeometry = new THREE.SphereGeometry(5);
                    let sphereMaterial = new THREE.MeshStandardMaterial({
                        color: "white",
                        roughness: 0,
                        metalness: 0,
                        map: texture
                    });
                    texture.needsUpdate = true;
                    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    texture = null;
                    sphere.position.set(0, 0, 0);
                    sphere.castShadow = true;
                    return sphere;
                },

                //创建群3D对象
                t_createGroupBall (group) {
                    let texture = this.t_createTexture(group.img);
                    let sphereGeometry = new THREE.SphereGeometry(7);
                    let sphereMaterial = new THREE.MeshStandardMaterial({
                        color: "white",
                        roughness: 0,
                        metalness: 0,
                        map: texture
                    });
                    texture.needsUpdate = true;
                    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    texture = null;
                    sphere.position.set(0, 0, 0);
                    sphere.castShadow = true;
                    return sphere;
                },
            //#endregion



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
                // let sphere = await this.createSphere();
                // this.scene.add(sphere);

                //添加直线光源
                let spotLight = new THREE.SpotLight(0xffffff);
                spotLight.position.set(-100, 200, -100);
                spotLight.castShadow = true;
                spotLight.shadowMapHeight = 1024;
                spotLight.shadowMapWidth = 1024;
                this.scene.add(spotLight);

                // let ambientLight = new THREE.AmbientLight(0xffffff);
                // scene.add(ambientLight);

                //添加半球光源
                let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.6);
                hemisphereLight.position.set(0, 200, 0);
                this.scene.add(hemisphereLight);
            },


            //#region 界面更新相关
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
            //#endregion
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

