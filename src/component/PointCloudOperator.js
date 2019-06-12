import React, { Component } from "react";
import '../css/ThreeMap.css';
import * as THREE from 'three';
import Orbitcontrols from 'three-orbitcontrols';
import Stats from '../common/threejslibs/stats.min.js';
import MyGUI from './MyGui';
import reqwest from 'reqwest';


class PointCloudOperator extends Component{
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

		init();
		animate();

		function init() {
			scene = new THREE.Scene();
			group = new THREE.Group();
			scene.add( group );

			camera = new THREE.PerspectiveCamera( 30, width / height, 1, 200 );
			camera.position.x = 0;
        	camera.position.y = 1;
			camera.position.z = 1;
			camera.lookAt( scene.position );
			
            //控制地球
            // let orbitControls = new /*THREE.OrbitControls*/Orbitcontrols(camera);
            // let orbitControls = new Orbitcontrols(camera);
        	// orbitControls.autoRotate = false;
        	// let clock = new THREE.Clock();
        	//光源
        	let ambi = new THREE.AmbientLight(0x686868);
        	scene.add(ambi);

        	let spotLight = new THREE.DirectionalLight(0xffffff);
        	spotLight.position.set(550, 100, 550);
        	spotLight.intensity = 0.6;

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
            loadPoints(46);

			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor( 'oxB2BABB' );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
			container.appendChild( renderer.domElement );
			stats = new Stats();
			container.appendChild( stats.dom );  //增加状态信息 
            stats.domElement.style.top = '50px';
            
            //创建坐标轴
            createAxes(1500);
            disPlayAxes(true)

            //初始化GUI
			initGui()
            
            

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
            let pointMaterial = new THREE.PointsMaterial({size: 0.001});
            let pointGeoWithMaterial = new THREE.Points(pointsGeo, pointMaterial);
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
                        loadPointGeometryToGroup(geo);
                        
                    }else{
                        console.log("load point failed");
                    }
                    
                })
        };
        

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
			// group.rotation.y -= 0.005;  //这行可以控制地球自转
			renderer.render( scene, camera );
		}
    }

    render() {
        return (
            <div id='WebGL-output'><MyGUI /></div>
			
        )
    }

}

export default PointCloudOperator
