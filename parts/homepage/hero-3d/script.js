/**
 * Hero 3D Scene - Coin Animation
 * Production-ready Three.js implementation for WordPress theme
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/loaders/GLTFLoader';
import { DRACOLoader } from 'three/loaders/DRACOLoader';
// import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';

registerComponent(async () => {
	/**
	 * 1. Get component parameters from URL
	 */
	const srcScript = new URL(import.meta.url);
	const queryParams = new URLSearchParams(srcScript.search);
	const uniqueId = queryParams.get('key');
	const templateUrl = queryParams.get('templateUrl');
	const model3d = queryParams.get('model3d');

	/**
	 * 2. Get DOM elements
	 */
	const parentEl = document.getElementById(uniqueId);
	const canvas = parentEl.querySelector('canvas.webgl');

	/**
	 * Performance Detection System
	 */
	class PerformanceDetector {
		constructor() {
			this.tier = this.detectTier();
		}

		detectTier() {
			const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
			const hardwareConcurrency = navigator.hardwareConcurrency || 2;
			const deviceMemory = navigator.deviceMemory || 4;
			
			const testCanvas = document.createElement('canvas');
			const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
			
			if (!gl) return 'low';
			
			const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
			const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
			
			let score = 0;
			
			if (isMobile) score -= 30;
			if (hardwareConcurrency >= 8) score += 20;
			else if (hardwareConcurrency >= 4) score += 10;
			if (deviceMemory >= 8) score += 15;
			else if (deviceMemory >= 4) score += 5;
			if (maxTextureSize >= 16384) score += 20;
			else if (maxTextureSize >= 8192) score += 10;
			if (maxVertexUniforms >= 512) score += 10;
			if (gl instanceof WebGL2RenderingContext) score += 15;
			
			const extensions = [
				'EXT_color_buffer_float',
				'OES_texture_float_linear',
				'EXT_texture_filter_anisotropic'
			];
			
			extensions.forEach(ext => {
				if (gl.getExtension(ext)) score += 5;
			});
			
			if (score >= 50) return 'high';
			if (score >= 20) return 'medium';
			return 'low';
		}

		getConfig() {
			const configs = {
				high: {
					shadows: true,
					shadowMapSize: 2048,
					antialias: true,
					postprocessing: false,
					pixelRatio: Math.min(window.devicePixelRatio, 2)
				},
				medium: {
					shadows: false,
					shadowMapSize: 1024,
					antialias: true,
					postprocessing: false,
					pixelRatio: Math.min(window.devicePixelRatio, 1.5)
				},
				low: {
					shadows: false,
					shadowMapSize: 512,
					antialias: false,
					postprocessing: false,
					pixelRatio: 1
				}
			};
			
			return configs[this.tier];
		}
	}

	/**
	 * Adaptive Quality Monitor
	 */
	class AdaptiveQuality {
		constructor(renderer, initialConfig) {
			this.renderer = renderer;
			this.config = initialConfig;
			this.frameCount = 0;
			this.fpsHistory = [];
			this.lastTime = performance.now();
			this.fps = 60;
		}
		
		monitor() {
			this.frameCount++;
			
			const currentTime = performance.now();
			const delta = currentTime - this.lastTime;
			this.fps = 1000 / delta;
			this.lastTime = currentTime;
			
			if (this.frameCount % 60 === 0) {
				this.fpsHistory.push(this.fps);
				
				if (this.fpsHistory.length > 5) {
					this.fpsHistory.shift();
				}
				
				const avgFps = this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length;
				
				if (avgFps < 25 && this.config.shadows) {
					console.log('⚠️ Low FPS detected, reducing quality...');
					this.config.shadows = false;
					this.config.shadowMapSize = 512;
				}
			}
		}
	}

	/**
	 * 3D Scene Implementation
	 */
	async function invokeThreeJS() {
		loaderElement.changeLoaderLabelState('Cargando entorno en 3D');
		
		// Performance detection
		const detector = new PerformanceDetector();
		const config = detector.getConfig();
		
		console.log(`🎮 Performance Tier: ${detector.tier}`);
		console.log('⚙️ Config:', config);
		
		// Scene setup
		let model;
		let portalMaterial = null;
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xd7d6dc);
		scene.fog = new THREE.Fog(0xd7d6dc, 0, 11.5);

		const stepsToHideLoader = 2;
		let stepsDone = 0;
		
		const sceneGroup = new THREE.Group();
		scene.add(sceneGroup);
		
		// Renderer
		const renderer = new THREE.WebGLRenderer({ 
			canvas,
			antialias: config.antialias,
			alpha: true 
		});
		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.setPixelRatio(config.pixelRatio);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;
		
		if (config.shadows) {
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		}
		
		// Adaptive quality monitoring
		const adaptiveQuality = new AdaptiveQuality(renderer, config);
		
		// Camera setup (orthographic)
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const frustumSize = 5;
		
		const camera = new THREE.OrthographicCamera(
			-frustumSize * aspect / 2,
			frustumSize * aspect / 2,
			frustumSize / 2,
			-frustumSize / 2,
			0.1,
			1000
		);

		function detectBreakpoint() {
			if(window.innerWidth > 1024) return 'desktop';
			if(window.innerWidth > 768) return 'tablet';
			return 'mobile';
		}
		
		function updateCameraPositionByBreakpoint() {
			if(window.innerWidth > 1024) {
				// desktop
				camera.position.set(4.45, 2.260, 4.35);
				camera.rotation.set(-2.707, 0.071, 3.109);
				camera.zoom = 1;
				camera.updateProjectionMatrix();
			} else if(window.innerWidth > 768) {
				// tablet
				camera.position.set(1.98, 1.2, 2.87);
				camera.rotation.set(-2.707, 0.071, 3.109);
				camera.zoom = 1;
				camera.updateProjectionMatrix();
			} else {
				// mobile
				camera.position.set(1.7, 1, 2.87);
				camera.rotation.set(-2.78, 0.071, 3.109);
				camera.zoom = 0.8;
				camera.updateProjectionMatrix();
			}
		}

		// Update camera position on window resize
		window.addEventListener('resize', updateCameraPositionByBreakpoint);
		updateCameraPositionByBreakpoint();

		// update camera position with lil gui
		// const gui = new GUI({ title: 'Camera Position' });
		// gui.add(camera.position, 'x').min(-10).max(10).step(0.01).name('Position X');
		// gui.add(camera.position, 'y').min(-10).max(10).step(0.01).name('Position Y');
		// gui.add(camera.position, 'z').min(-10).max(10).step(0.01).name('Position Z');
		// gui.add(camera.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation X');
		// gui.add(camera.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation Y');
		// gui.add(camera.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation Z');

		
		// Texture loading
		const textureLoader = new THREE.TextureLoader();
		const bakedTexture = textureLoader.load(`${templateUrl}/assets/3d/parts/homepage/hero-3d/baked_final (blue compressed version).jpg`);
		bakedTexture.flipY = false;
		bakedTexture.colorSpace = THREE.SRGBColorSpace;
		bakedTexture.minFilter = THREE.LinearFilter;
		bakedTexture.magFilter = THREE.LinearFilter;
		bakedTexture.generateMipmaps = false;
		
		// Materials
		const bakedMaterial = new THREE.MeshBasicMaterial({ 
			map: bakedTexture 
		});

		// Apply custom material to Coin001 with JPG envMap (using standard TextureLoader)
		const pmremGenerator = new THREE.PMREMGenerator(renderer);
		pmremGenerator.compileEquirectangularShader();
		
		// Mouse tracking
		const mousePos = { x: 0, y: 0 };
		let coinMesh = null;
		let mixer = null;
		let coinAction = null;
		let coinAnimationState = 'initial';
		let coinFloatOffset = 0;
		let coinFinalPosition = null;
		
		// GLTF Loading
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
		dracoLoader.setDecoderConfig({ type: 'js' });
		
		const gltfLoader = new GLTFLoader();
		gltfLoader.setDRACOLoader(dracoLoader);

		const checkLoader = () => {
			stepsDone++;
			console.log('✅ Loader step done', stepsDone);
			if (stepsDone >= stepsToHideLoader) {
				// Hide loader
				if (window.loaderElement) {
					console.log('✅ Loader hidden');
					window.loaderElement.onLoaded();
					// Start animation sequence after delay
					setTimeout(() => {
						startCoinAnimation();
					}, 1000);
				}
			}
		}
		
		await gltfLoader.load(
			`${templateUrl}/assets/3d/parts/homepage/hero-3d/v3 __.glb`,
			async (gltf) => {
				console.log('✅ Model loaded successfully');
				model = gltf.scene;
				sceneGroup.add(model);

		// Load coin material texture
		textureLoader.load(`${templateUrl}/assets/3d/parts/homepage/hero-3d/gradiente-azul.jpg`, async (gradientTexture) => {
			gradientTexture.colorSpace = THREE.SRGBColorSpace;
			const envMap = pmremGenerator.fromEquirectangular(gradientTexture).texture;
			const coinMaterial = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				envMap: envMap,
				envMapIntensity: 1,
				roughness: 0.312,
				metalness: 0.361,
				transparent: true,
				opacity: 0
			});
			const machineReflectMaterial = new THREE.MeshStandardMaterial({
				color: 0xffffff,
				envMap: envMap,
				envMapIntensity: 1.25,
				roughness: 0.312,
				metalness: 0.361,
			});

			// Custom Portal Material - Advanced Portal Shader
			const debugObject = {
				color: '#b29ede',
				color2: '#9fa9df', // Second color (darker purple by default)
				noiseScale: 2.0,
				noiseSpeed: 0.38,
				noiseStrength: 0.01,
				lightIntensity: 2.2,
				zOffset: -0.1 // Translate Z / Depth Offset
			};

			// const isLowPerf = detector.tier === 'low' || detectBreakpoint() === 'mobile';
			const isLowPerf = true;

			if (isLowPerf) {
				portalMaterial = new THREE.MeshStandardMaterial({
					color: 0xffffff,
					envMap: envMap,
					envMapIntensity: 1.25,
					roughness: 0.312,
					metalness: 0.361
				});
			} else {
				portalMaterial = new THREE.ShaderMaterial({
					uniforms: {
						uTime: { value: 0 },
						uColor: { value: new THREE.Color(debugObject.color) },
						uColor2: { value: new THREE.Color(debugObject.color2) },
						uNoiseScale: { value: debugObject.noiseScale },
						uNoiseSpeed: { value: debugObject.noiseSpeed },
						uNoiseStrength: { value: debugObject.noiseStrength },
						uLightIntensity: { value: debugObject.lightIntensity },
						uZOffset: { value: debugObject.zOffset }
					},
					vertexShader: `
						varying vec2 vUv;
						varying vec3 vPosition;
						varying float vNoise;
						uniform float uTime;
						uniform float uNoiseScale;
						uniform float uNoiseSpeed;
						uniform float uNoiseStrength;
						uniform float uZOffset;
						
						// Simplex 3D Noise 
						vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
						vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
						vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
						vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
						float snoise(vec3 v) {
							const vec2 C = vec2(1.0/6.0, 1.0/3.0);
							const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
							vec3 i  = floor(v + dot(v, C.yyy));
							vec3 x0 = v - i + dot(i, C.xxx);
							vec3 g = step(x0.yzx, x0.xyz);
							vec3 l = 1.0 - g;
							vec3 i1 = min(g.xyz, l.zxy);
							vec3 i2 = max(g.xyz, l.zxy);
							vec3 x1 = x0 - i1 + C.xxx;
							vec3 x2 = x0 - i2 + C.yyy;
							vec3 x3 = x0 - D.yyy;
							i = mod289(i);
							vec4 p = permute(permute(permute(
									 i.z + vec4(0.0, i1.z, i2.z, 1.0))
								   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
								   + i.x + vec4(0.0, i1.x, i2.x, 1.0));
							float n_ = 0.142857142857;
							vec3 ns = n_ * D.wyz - D.xzx;
							vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
							vec4 x_ = floor(j * ns.z);
							vec4 y_ = floor(j - 7.0 * x_);
							vec4 x = x_ * ns.x + ns.yyyy;
							vec4 y = y_ * ns.x + ns.yyyy;
							vec4 h = 1.0 - abs(x) - abs(y);
							vec4 b0 = vec4(x.xy, y.xy);
							vec4 b1 = vec4(x.zw, y.zw);
							vec4 s0 = floor(b0) * 2.0 + 1.0;
							vec4 s1 = floor(b1) * 2.0 + 1.0;
							vec4 sh = -step(h, vec4(0.0));
							vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
							vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
							vec3 p0 = vec3(a0.xy, h.x);
							vec3 p1 = vec3(a0.zw, h.y);
							vec3 p2 = vec3(a1.xy, h.z);
							vec3 p3 = vec3(a1.zw, h.w);
							vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
							p0 *= norm.x;
							p1 *= norm.y;
							p2 *= norm.z;
							p3 *= norm.w;
							vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
							m = m * m;
							return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
						}

						void main() {
							vUv = uv;
							
							// Add offset to position before noise calculation for "texture movement" feel
							vec3 p = (position + vec3(0.0, 0.0, uZOffset)) * uNoiseScale;
							float time = uTime * uNoiseSpeed;
							
							// Ridged multifractal-ish feel
							float n = snoise(vec3(p.x, p.y, p.z + time));
							float n2 = snoise(vec3(p.x * 2.0, p.y * 2.0, p.z + time * 1.5)) * 0.5;
							
							float combinedNoise = n + n2;
							float ridge = 1.0 - abs(combinedNoise);
							ridge = ridge * ridge * ridge;
							
							vNoise = ridge;
							
							vec3 newPos = position + normal * ridge * uNoiseStrength;
							vPosition = newPos;
							
							gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
						}
					`,
					fragmentShader: `
						uniform vec3 uColor;
						uniform vec3 uColor2;
						uniform float uLightIntensity;
						varying vec3 vPosition;
						varying float vNoise;
						
						void main() {
							// Calculate normal using derivatives for flat/faceted look or smooth depending on resolution
							vec3 fdx = dFdx(vPosition);
							vec3 fdy = dFdy(vPosition);
							vec3 normal = normalize(cross(fdx, fdy));
							
							// Lighting
							vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
							float diffuse = max(dot(normal, lightDir), 0.0);
							
							// Specular / Shine
							vec3 viewDir = normalize(cameraPosition - vPosition);
							vec3 reflectDir = reflect(-lightDir, normal);
							float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
							
							// Mix color based on noise height
							// Use two explicit colors instead of dark/light variants of one
							vec3 finalColor = mix(uColor2, uColor, vNoise);
							
							// Add lighting
							finalColor *= (diffuse * 0.7 + 0.3) * uLightIntensity; 
							finalColor += vec3(1.0) * spec * 0.4; // Add specular shine
							
							gl_FragColor = vec4(finalColor, 1.0);
						}
					`,
					side: THREE.DoubleSide
				});
			}

			// const gui = new GUI();
			// gui.addColor(debugObject, 'color').name('Color Principal').onChange(() => {
			// 	portalMaterial.uniforms.uColor.value.set(debugObject.color);
			// });
			// gui.addColor(debugObject, 'color2').name('Color Fondo').onChange(() => {
			// 	portalMaterial.uniforms.uColor2.value.set(debugObject.color2);
			// });
			// gui.add(debugObject, 'noiseScale').min(0).max(10).step(0.1).name('Escala Ruido').onChange(() => {
			// 	portalMaterial.uniforms.uNoiseScale.value = debugObject.noiseScale;
			// });
			// gui.add(debugObject, 'noiseSpeed').min(0).max(2).step(0.01).name('Velocidad').onChange(() => {
			// 	portalMaterial.uniforms.uNoiseSpeed.value = debugObject.noiseSpeed;
			// });
			// gui.add(debugObject, 'noiseStrength').min(0).max(2).step(0.01).name('Fuerza').onChange(() => {
			// 	portalMaterial.uniforms.uNoiseStrength.value = debugObject.noiseStrength;
			// });
			// gui.add(debugObject, 'lightIntensity').min(0).max(5).step(0.1).name('Intensidad Luz').onChange(() => {
			// 	portalMaterial.uniforms.uLightIntensity.value = debugObject.lightIntensity;
			// });
			// gui.add(debugObject, 'zOffset').min(-10).max(10).step(0.1).name('Posición Textura (Z)').onChange(() => {
			// 	portalMaterial.uniforms.uZOffset.value = debugObject.zOffset;
			// });
			
			// Apply materials to meshes
			gltf.scene.traverse((child) => {
				if (child.isMesh) {
					if (child.name === 'Cylinder008_2' && child.material?.name === 'Material.003') {
						child.material = portalMaterial;
						
						// Replace geometry with high-resolution CircleGeometry for better wave effect
						if (child.geometry) {
							child.geometry.computeBoundingBox();
							const box = child.geometry.boundingBox;
							const width = (box.max.x - box.min.x) * 1.25;
							const height = (box.max.y - box.min.y) * 1.25;
							const depth = (box.max.z - box.min.z) * 1.25;
							
							// Estimate radius from the largest dimension
							const radius = Math.max(width, height, depth) / 2;
							
							// Create new geometry with high segment count (using RingGeometry with innerRadius=0 for internal subdivisions)
							const newGeometry = new THREE.RingGeometry(0, radius, 64, 64);
							
							// Align orientation based on bounding box dimensions
							// If it's flat on XZ plane (Y is smallest)
							if (height < width && height < depth) {
								newGeometry.rotateX(-Math.PI / 2);
							}
							// If it's flat on YZ plane (X is smallest)
							else if (width < height && width < depth) {
								newGeometry.rotateY(Math.PI / 2);
							}

							// Center the new geometry to match the original's position offset
							const center = new THREE.Vector3();
							box.getCenter(center);
							// Apply slight Z offset (-0.1) as requested
							newGeometry.translate(center.x, center.y, center.z - 0.1);
							
							console.log('✨ Portal geometry replaced. Radius:', radius, 'Center:', center);
							
							child.geometry.dispose();
							child.geometry = newGeometry;

							// Set initial position as requested
							child.position.set(0.03, -0.01, 0.14);

							// Add position controls for the mesh
							// const posFolder = gui.addFolder('Posición Portal (Mesh)');
							// posFolder.add(child.position, 'x').min(-10).max(10).step(0.01).name('Posición X');
							// posFolder.add(child.position, 'y').min(-10).max(10).step(0.01).name('Posición Y');
							// posFolder.add(child.position, 'z').min(-10).max(10).step(0.01).name('Posición Z');
						}
					} else if(
						(child.name === 'Curve002' && child.material?.name === 'Material.003') ||
						(child.name === 'Curve001' && child.material?.name === 'Material.004') ||
						(child.name === 'Cylinder008_1' && child.material?.name === 'Material.005')
					) {
						child.material = machineReflectMaterial;
					} 
					else if (
						child.name === 'Coin001'
					) {
						child.material = coinMaterial;
						
						// Capture reference to the coin mesh
						if (child.name === 'Coin001') {
							coinMesh = child;
						}
					} else {
						child.material = bakedMaterial;
					}
				}
			});
			
			// Call checkLoader once after all materials are applied
			checkLoader();
		});
				
				// Setup animations
				if (gltf.animations && gltf.animations.length > 0) {
					mixer = new THREE.AnimationMixer(model);
					mixer.timeScale = 1.75;
					
					const coinClip = gltf.animations.find(clip => {
						const nameMatch = clip.name.toLowerCase().includes('coin');
						const trackMatch = clip.tracks.some(track => 
							track.name.includes('Coin001') || track.name.includes('Coin.001')
						);
						return nameMatch || trackMatch;
					});
					
					if (coinClip) {
						coinAction = mixer.clipAction(coinClip);
						coinAction.setLoop(THREE.LoopOnce, 1);
						coinAction.clampWhenFinished = true;
						console.log('🪙 Coin animation found:', coinClip.name);

						// window.loaderElement.onLoaded();
						checkLoader();
					}
				}
			},
			(progress) => {
				const percent = (progress.loaded / progress.total * 100).toFixed(0);
				console.log(`Loading: ${percent}%`);
			},
			(error) => {
				console.error('❌ Error loading model:', error);
				if (window.loaderElement) {
					window.loaderElement.onLoaded();
				}
			}
		);
		
		// Animation functions
		function startCoinAnimation() {
			if (!coinAction) {
				startFloatingAnimation();
				return;
			}
			
			coinAnimationState = 'coin';
			console.log('🪙 Starting coin animation');
			
			coinAction.reset();
			coinAction.play();
			
			mixer.addEventListener('finished', onCoinAnimationFinished);
		}
		
		function onCoinAnimationFinished(event) {
			if (event.action === coinAction) {
				console.log('✅ Coin animation finished');
				mixer.removeEventListener('finished', onCoinAnimationFinished);
				
				if (coinMesh) {
					// Ensure full opacity when finished
					coinMesh.material.opacity = 1;
					
					coinFinalPosition = {
						x: coinMesh.position.x,
						y: coinMesh.position.y,
						z: coinMesh.position.z
					};
				}
				
				startFloatingAnimation();
			}
		}
		
		function startFloatingAnimation() {
			coinAnimationState = 'floating';
			console.log('🎈 Starting floating animation');
			
			if (!coinFinalPosition && coinMesh) {
				coinFinalPosition = {
					x: coinMesh.position.x,
					y: coinMesh.position.y,
					z: coinMesh.position.z
				};
			}
		}
		
		// Mouse tracking
		function onMouseMove(event) {
			mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
			mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
		}
		window.addEventListener('mousemove', onMouseMove);
		
		// Resize handler
		function onWindowResize() {
			const aspect = canvas.clientWidth / canvas.clientHeight;
			const frustumSize = camera.top - camera.bottom;
			
			camera.left = -frustumSize * aspect / 2;
			camera.right = frustumSize * aspect / 2;
			camera.top = frustumSize / 2;
			camera.bottom = -frustumSize / 2;
			camera.updateProjectionMatrix();
			
			renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		}
		window.addEventListener('resize', onWindowResize);
		
		// Animation loop
		const clock = new THREE.Clock();
		
		function animate() {
			requestAnimationFrame(animate);
			
			// Cap delta to prevent animation jumps when returning from another tab
			const rawDelta = clock.getDelta();
			const delta = Math.min(rawDelta, 0.1);
			
			if (mixer) {
				mixer.update(delta);
				
				// Sync opacity with animation progress
				if (coinAnimationState === 'coin' && coinAction && coinMesh) {
					const duration = coinAction.getClip().duration;
					const currentTime = coinAction.time;
					// Map time to 0-1 opacity
					const opacity = Math.min(Math.max(currentTime / duration, 0), 1);
					coinMesh.material.opacity = opacity;
				}
			}

			// Update portal shader time
			if (portalMaterial && portalMaterial.uniforms) {
				// Use accumulated time or just keep existing elapsed time
				// Note: getElapsedTime() continues running, which is fine for shader noise
				portalMaterial.uniforms.uTime.value = clock.getElapsedTime();
			}
			
			adaptiveQuality.monitor();
			
			const isDesktop = detectBreakpoint() === 'desktop';

			// Floating animation
			if (coinAnimationState === 'floating' && coinMesh && coinFinalPosition) {
				coinFloatOffset += delta * 0.5;
				const floatAmplitude = 0.15;
				const rawSin = Math.sin(coinFloatOffset);
				const smoothFloat = rawSin * rawSin * rawSin;
				const smoothY = smoothFloat * floatAmplitude;
				
				coinMesh.position.y = coinFinalPosition.y + smoothY;
				
				const rotationSpeed = 0.5;
				const targetRotationY = isDesktop ? -mousePos.x * rotationSpeed : 0;
				const targetRotationX = isDesktop ? mousePos.y * rotationSpeed : 0;
				const rotationDamping = 5;
				
				coinMesh.rotation.y += (targetRotationY - coinMesh.rotation.y) * delta * rotationDamping;
				coinMesh.rotation.x += (targetRotationX - coinMesh.rotation.x) * delta * rotationDamping;
			}
			
			// Scene group rotation based on cursor
			if (sceneGroup) {
				const sceneRotationIntensityX = 0.015;
				const sceneRotationIntensityY = 0.05;
				
				const targetSceneRotY = isDesktop ? mousePos.x * sceneRotationIntensityY : 0;
				const targetSceneRotX = isDesktop ? -mousePos.y * sceneRotationIntensityX : 0;
				const sceneDamping = 2.0;
				
				sceneGroup.rotation.y += (targetSceneRotY - sceneGroup.rotation.y) * delta * sceneDamping;
				sceneGroup.rotation.x += (targetSceneRotX - sceneGroup.rotation.x) * delta * sceneDamping;
			}
			
			renderer.render(scene, camera);
		}
		
		animate();
	}
	
	// Initialize the 3D scene
	invokeThreeJS();
});