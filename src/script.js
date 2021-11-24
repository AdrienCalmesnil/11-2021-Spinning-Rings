import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { DoubleSide, PointLightHelper } from 'three'
import gsap from 'gsap'

// Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/NormalMap.png')

// Debug
const gui = new dat.GUI()
// dat.GUI.toggleHide();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const planeGeometry = new THREE.TorusGeometry(1.8, 0.05, 16, 100 )
const planeGeometry2 = new THREE.TorusGeometry(1.9, 0.05, 16, 100 )
const planeGeometry3 = new THREE.TorusGeometry(1.7, 0.05, 16, 100 )
const boxGeometry = new THREE.IcosahedronGeometry(1)
const floorGeometry = new THREE.CylinderGeometry(2.1, 4.8, 8, 8)

// Materials
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture
material.color = new THREE.Color(0x181818) //0xFFFFFF

const materialGold = new THREE.MeshStandardMaterial()
materialGold.metalness = 0.8
materialGold.roughness = 0.2
materialGold.color = new THREE.Color(0xFFD700) //0xFFFFFF

const materialFloor = new THREE.MeshStandardMaterial()
materialFloor.opacity = 0.7


// Mesh
const plane = new THREE.Mesh(planeGeometry,materialGold)
const plane2 = new THREE.Mesh(planeGeometry2,materialGold)
const plane3 = new THREE.Mesh(planeGeometry3, materialGold)
const box = new THREE.Mesh(boxGeometry, material)
const floor = new THREE.Mesh(floorGeometry, materialFloor)

scene.add(plane, plane2, plane3, box, floor)

// Mesh positioning
plane.position.y = 0.6
plane2.position.y = 0.6
plane3.position.y = 0.6
box.position.y = 0.6
floor.position.set(0, -5.5, 0) 

// Mesh shadow collisions
plane.castShadow = true
plane.receiveShadow = true
plane2.castShadow = true
plane2.receiveShadow = true
plane3.castShadow = true
plane3.receiveShadow = true
box.castShadow = true
box.receiveShadow = true
floor.receiveShadow = true

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 0
pointLight.position.y = 10
pointLight.position.z = 0
pointLight.castShadow = true
scene.add(pointLight)

const light1 = gui.addFolder('Light 1')

light1.add(pointLight.position, 'y').min(-3).max(10).step(0.01)
light1.add(pointLight.position, 'x').min(-6).max(6).step(0.01)
light1.add(pointLight.position, 'z').min(-3).max(4).step(0.01)
light1.add(pointLight, 'intensity').min(0).max(10).step(0.01)

// const pointLightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(pointLightHelper)

// Light 2

const pointLight2 = new THREE.PointLight(0xDF00FF, 2)
pointLight2.position.set( -4.93, -2.47, -0.61)
pointLight2.intensity = 1.11
scene.add(pointLight2)

const light2 = gui.addFolder('Light 2')

light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

const light2Color = { color : 0xDF00FF }

light2.addColor(light2Color, 'color')
    .onChange(() => {
        pointLight2.color.set(light2Color.color)
    })

// const pointLight2Helper = new THREE.PointLightHelper(pointLight2)
// scene.add(pointLight2Helper)

// Light 3

const pointLight3 = new THREE.PointLight(0xffffff)
pointLight3.position.set( 6, 0.76, 3)
pointLight3.intensity = 0.8
pointLight3.castShadow = true
scene.add(pointLight3)

const light3 = gui.addFolder('Light 3')

light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

const light3Color = { color : 0xffffff }

light3.addColor(light3Color, 'color')
    .onChange(() => {
        pointLight3.color.set(light3Color.color)
    })

// const pointLight3Helper = new THREE.PointLightHelper(pointLight3)
// scene.add(pointLight3Helper)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
scene.add(camera)

const camera1 = gui.addFolder('Camera 1')
camera1.add(camera.position, 'z').min(2).max(10).step(0.5)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true //supprime le background 
})
renderer.shadowMap.enabled = true // turn on shadows in the renderer
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

// Scroll animation
const updatePlane = (event) => {
    box.position.y = window.scrollY * .001
}

window.addEventListener('scroll', updatePlane)

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // 
    plane.rotation.y = .5 * elapsedTime
    plane.rotation.x = 0.5 * elapsedTime

    plane3.rotation.y = -(.5 * elapsedTime) * 2
    plane3.rotation.x = 0.5 * elapsedTime

    box.rotation.y = -(.5 * elapsedTime - 10 * 5)
    box.rotation.x = 0.5 * elapsedTime

    box.rotation.y += .5 * (targetX - plane.rotation.y)

    // Update Orbital Controls -> controle de la scène
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()