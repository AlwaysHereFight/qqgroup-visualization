
<style scoped>
    #threeContainer {
        position: fixed;
        width: 100%;
        height: 100%;
    }
</style>

<template>
    <div id="threeContainer">
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
            }
        },
        methods: {
            createScene () {
                return new THREE.Scene();
            },
            createCamera () {
                let camera = null;
                camera = new THREE.PerspectiveCamera(45, this.$el.clientWidth / this.$el.clientHeight, 0.1, 1000);
                camera.position.x = 0;
                camera.position.y = 100;
                camera.position.z = 100;
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

            createSphere () {
                let sphereGeometry = new THREE.SphereGeometry(10, 20, 20);
                let sphereMaterial = new THREE.MeshStandardMaterial({
                    color: 0x7777ff
                });
                let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                sphere.position.set(30, 30, 30);
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

            addGeometry (scene) {
                //添加坐标系
                // let axes = new THREE.AxesHelper(50);
                // scene.add(axes);

                //在底部添加一个平面
                let plane = this.createPlane();
                this.scene.add(plane);
                //添加一个立方体
                // cube = createCube();
                // scene.add(cube);
                // 添加一个球体
                let sphere = this.createSphere();
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
            }
        },
        mounted () {
            this.scene = this.createScene();
            this.camera = this.createCamera();
            this.camera.lookAt(this.scene.position);
            this.render = this.createRender();

            this.addGeometry();

            this.$el.appendChild(this.render.domElement);

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

