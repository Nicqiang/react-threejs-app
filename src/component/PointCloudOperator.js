import React, { Component } from "react";
import '../css/ThreeMap.css';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import Stats from '../common/threejslibs/stats.min.js';
import PLYLoader from '../common/threejslibs/PLYLoader';
import MyGUI from './MyGui';
import reqwest from 'reqwest';
import { message } from "antd";


class PointCloudOperator extends Component{

    

    constructor(props){
        super(props);
        this.callByMyGui = this.callByMyGui.bind(this);
    }

    state = {
        pointSize: 0.001,
        pointColor: '',

    }

    componentDidMount(){
        this.initThree();
    }
    
	

    initThree() {
        let stats;
		let camera, scene, renderer;
		let group;
		let container = document.getElementById('WebGL-output');
        let width = container.clientWidth,height = container.clientHeight;
        let axes;
        let pointsSzie = this.state.pointSize;
        let pointGeoWithMaterial;
        let isUpdateModel = false;

		init();
		animate();

		function init(pointsSzie) {
            console.log("pointSize="+pointsSzie)
			scene = new THREE.Scene();
			group = new THREE.Group();
			scene.add( group );

			camera = new THREE.PerspectiveCamera( 55, width / height, 0.01, 200 );
			camera.position.x = 0;
        	camera.position.y = 0;
			camera.position.z = 2;
			camera.lookAt( 0,0,0);
			
        	// orbitControls.autoRotate = false;
        	// let clock = new THREE.Clock();
        	//光源
        	let ambi = new THREE.AmbientLight(0x686868);
        	scene.add(ambi);

        	let spotLight = new THREE.DirectionalLight(0xffffff);
        	spotLight.position.set(550, 100, 550);
        	spotLight.intensity = 0.8;

        	scene.add(spotLight);
			// Texture
			// let loader = new THREE.TextureLoader();
			// let planetTexture = require("../assets/imgs/planets/Earth.png");

			// loader.load( planetTexture, function ( texture ) {
			// 	let geometry = new THREE.SphereGeometry( 200, 20, 20 );
			// 	let material = new THREE.MeshBasicMaterial( { map: texture } );
			// 	let mesh = new THREE.Mesh( geometry, material );
			// 	group.add( mesh );
            // } );
            //loadPoints(51);
            viewPLY("/Users/nicqiang/HIT-Course/HIT-SE-COURSE /毕业论文/点云/dragon.ply", scene);

			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor( 'oxB2BABB' );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
			
            
            initStats();

            //创建坐标轴
            createAxes(1500);
            disPlayAxes(true)

            //初始化GUI
			initGui()
            
            

        }

        /**
         * 初始化状态栏显示
         */
        function initStats(){
            container.appendChild( renderer.domElement );
			stats = new Stats();
			container.appendChild( stats.dom );  //增加状态信息 
            stats.domElement.style.top = '50px';
        }

        function loadPointGeometryToGroup(pointsGeo){
            // let loader = new THREE.TextureLoader();
			// let planetTexture = require("../assets/imgs/planets/Earth.png");

			// loader.load( planetTexture, function ( texture ) {
			// 	let geometry = new THREE.SphereGeometry( 200, 20, 20 );
			// 	let material = new THREE.MeshBasicMaterial( { map: texture } );
			// 	let mesh = new THREE.Mesh( geometry, material );
			// 	group.add( mesh );
            // } );
            let pointMaterial = new THREE.PointsMaterial({size: pointsSzie});
            pointGeoWithMaterial = new THREE.Points(pointsGeo, pointMaterial);
            pointGeoWithMaterial.material.size = pointsSzie;
            group.add(pointGeoWithMaterial);
            console.log("load finshed")

        }

        function loadPoints(id){
            fetch('http://127.0.0.1:8080/operator/' + id,{
            method: 'GET'

            }).then(res => res.json())
                .then(data => {
                    if(data.code == 200){
                        let geo = new THREE.Geometry();
                        let arrs = data.data.points.split(";");
                        // console.log(arrs)
                        arrs.forEach(function  (v, index){
                            let v_p = v.split(",");
                            // console.log(v_p)
                            // console.log(parseFloat(v_p[2]));
                            geo.vertices.push(new THREE.Vector3(parseFloat(v_p[0]), parseFloat(v_p[1]), parseFloat(v_p[2])));
                        })
                        message.info("load from server success");
                        loadPointGeometryToGroup(geo);
                    }else{
                        console.log("load point failed");
                    }
                    
                })
        };

        function viewPLY(filePath, sence){
            var loader = new PLYLoader();
            loader.load(filePath, function(geometry){
                geometry.computeVertexNormals();
        
                    //创建纹理，并将模型添加到场景道中
                var material = new THREE.MeshStandardMaterial( {flatShading: true } );
                    // var material = new THREE.MeshStandardMaterial( { color: 0x0055ff, flatShading: true } );
                    // var material = new THREE.MeshLamebertMaterial({color: 0x7777ff});
                var mesh = new THREE.Mesh( geometry, material );
                mesh.rotation.y = Math.PI;
                mesh.scale.set(0.05, 0.05, 0.05);
                scene.add( mesh );
        
            });
        }
        

        function initGui(){
            let orbitControls = new Orbitcontrols(camera, render.domElement);
            orbitControls.autoRotate = false;

        }

        

        /**
         * 创建坐标轴
         * @param {*} axesSize 长度
         */
        function createAxes(axesSize){
            axes = new THREE.AxesHelper(axesSize);
        }

        /**
         * 显示坐标轴
         */
        function disPlayAxes(isDisplay){
            if(isDisplay){
                // 坐标轴,可选
                let axes = new THREE.AxesHelper(1500);
                scene.add(axes);
            }
        }
        
        
		
		function animate() {
			requestAnimationFrame( animate );
			render();
			stats.update();
		}
		function render() {		
            // if(isUpdateModel){

            // }
            //更新点大小
            // console.log(JSON.stringify(pointGeoWithMaterial));
            // pointGeoWithMaterial.material.size  = pointsSzie;
            // group.rotation.y -= 0.005;  //这行可以控制地球自转
            renderer.render( scene, camera );

        }
        
    }

    callByMyGui(e){
        console.log(e)
        if(e.displayType="point" && e.isReload){
            // pointSize = e.pointSize;
            console.log("加载数据")
        }
    }

    render() {
        return (
            <div id='WebGL-output'><MyGUI callResult={this.callByMyGui}/></div>
			
        )
    }

}

export default PointCloudOperator
