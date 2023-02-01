import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// Texture
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()
gui.close()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Text
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Sudeepto Bose\nCreative Developer\n3D Modeling Hobbyist',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        textGeometry.center()
        const textMaterial = new THREE.MeshStandardMaterial()
        textMaterial.metalness = 0.3
        textMaterial.roughness = 0.4
        textMaterial.color.set(0xF08A5D)
        textMaterial.transparent = true
        textMaterial.opacity= 0.95
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
        const textColor = {
            color:0xF08A5D
        }
        const textControls = gui.addFolder('Text Controls')
        textControls.addColor(textColor, 'color').onChange(()=>{
            textMaterial.color.set(textColor.color)
        }).name('Text Color')
        textControls.add(text, 'visible').name('Text Visibility')
        textControls.add(textMaterial, 'wireframe').name('Text Wireframe')
        textControls.add(textMaterial, 'metalness').min(0).max(1).step(0.001).name('Text Mentalness')       
        textControls.add(textMaterial, 'roughness').min(0).max(1).step(0.001).name('Text Roughness')
        textControls.add(text.position, 'x').min(-3).max(3).step(0.01).name('Text Position X')
        textControls.add(text.position, 'y').min(-3).max(3).step(0.01).name('Text Position Y')
        textControls.close()
    }
)

const evasColor = {
    color: 0xc845d3
}
gui.addColor(evasColor, 'color').onChange(()=>{
    evasMaterial.color.set(evasColor.color)
}).name('IcosaHedron Color')
const isoColor = {
    color: 0xd71919
}
gui.addColor(isoColor, 'color').onChange(()=>{
    isoMaterial.color.set(isoColor.color)
}).name('Octahedron Color')

// // Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper) 

// Objects
const evasMaterial = new THREE.MeshStandardMaterial()
evasMaterial.color.set(0xc845d3)
evasMaterial.transparent = true
evasMaterial.opacity = 0.7
const evasGeometry = new THREE.OctahedronGeometry()
for(let i = 0; i < 20; i++)
{
    const evas = new THREE.Mesh( evasGeometry, evasMaterial)
    evas.position.x = (Math.random() - 0.5) * 30
    evas.position.y = (Math.random() - 0.5) * 30
    evas.position.z = (Math.random() - 0.5) * 30
    evas.rotation.x = Math.random() * Math.PI
    evas.rotation.y = Math.random() * Math.PI
    const scale = Math.random() * 3
    evas.scale.set(scale, scale, scale)
    scene.add(evas)
}

const isoMaterial = new THREE.MeshStandardMaterial()
isoMaterial.color.set(0xd71919)
isoMaterial.transparent = true
isoMaterial.opacity = 0.6
const isoGeometry = new THREE.IcosahedronGeometry()
for(let i = 0; i < 100; i++)
{
    const iso = new THREE.Mesh( isoGeometry, isoMaterial)
    iso.position.x = (Math.random() - 0.5) * 25
    iso.position.y = (Math.random() - 0.5) * 25
    iso.position.z = (Math.random() - 0.5) * 25
    iso.rotation.x = Math.random() * Math.PI
    iso.rotation.y = Math.random() * Math.PI
    const scale = Math.random() * 0.5
    iso.scale.set(scale, scale, scale)
    scene.add(iso)
}

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Resize
window.addEventListener('resize', ()=>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1 , 100)
camera.position.x = -2
camera.position.z = 2.4
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Clock

const clock = new THREE.Clock()

// Fullscreen
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

// Tick function
const tick = ()=>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()
