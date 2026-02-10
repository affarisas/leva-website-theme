const { } = registerComponent(() => {
  /**
	 * 1. Key
	 * 
	 * @description Obtener el ID del key generado desde PHP extrayendo el src="" único de este script invocado.
	 */
	const srcScript = new URL(document.currentScript.src); // import.meta.url equivalent when using module scripts. (<script type="module">)
	const queryParams = new URLSearchParams(srcScript.search);
	const uniqueId = queryParams.get('key');
	const templateUrl = queryParams.get('templateUrl');
	const model3d = queryParams.get('model3d');
	const orientation = queryParams.get('orientation');
	const componentName = queryParams.get('componentName');

  /**
	 * 2. Global (component-scope) variables
	 * 
	 * @description Crear controles y lógica sólo para el contenedor con el id único
	 */
	const parentEl = document.getElementById(uniqueId)

  const canvas = parentEl.querySelector("canvas.webgl")
  let is3dLoaded = false

  const toastController = new Toast()
  
  function enable3d() {
    if(is3dLoaded) return; // evitar que se cargue lo de abajo si ya se cargó anteriormente

    /**
     * No se ha cargado el loader
     */
    window.loaderElement = renderLoader(canvas, orientation || 'right', templateUrl)

    // Carga el script three.min.js
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.156.1/three.min.js';
    document.head.appendChild(script1);

    // Carga el script es-module-shims.js
    const script2 = document.createElement('script');
    script2.src = 'https://unpkg.com/es-module-shims@1.8.0/dist/es-module-shims.js';
    script2.async = true;
    document.head.appendChild(script2);

    // Carga el importmap
    const script3 = document.createElement('script');
    script3.type = 'importmap';
    // script3.innerHTML = `
    //   {
    //     "imports": {
    //       "lil-gui": "https://cdn.skypack.dev/lil-gui",
    //       "tween": "https://cdn.skypack.dev/@tweenjs/tween.js",
    //       "three": "https://unpkg.com/three@0.156.1/build/three.module.js",
    //       "three/controls/OrbitControls": "https://unpkg.com/three@0.156.1/examples/jsm/controls/OrbitControls.js",
    //       "three/loaders/DRACOLoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/DRACOLoader.js",
    //       "three/loaders/GLTFLoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/GLTFLoader.js",
    //       "three/loaders/RGBELoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/RGBELoader.js",
    //       "three/loaders/EXRLoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/EXRLoader.js",
    //       "three/postprocessing/EffectComposer": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/EffectComposer.js",
    //       "three/postprocessing/UnrealBloomPass": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/UnrealBloomPass.js",
    //       "three/postprocessing/RenderPass": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/RenderPass.js",
    //       "three/postprocessing/ShaderPass": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/ShaderPass.js",
    //       "three/shaders/GammaCorrectionShader": "https://unpkg.com/three@0.156.1/examples/jsm/shaders/GammaCorrectionShader.js",
    //       "three/shaders/RGBShiftShader": "https://unpkg.com/three@0.156.1/examples/jsm/shaders/RGBShiftShader.js",
    //       "three/shaders/FXAAShader": "https://unpkg.com/three@0.156.1/examples/jsm/shaders/FXAAShader.js"
    //     }
    //   }
    // `;
    script3.innerHTML = `
      {
        "imports": {
          "detect-gpu": "https://unpkg.com/detect-gpu@latest/dist/detect-gpu.umd.js",
          "lil-gui": "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm",
          "tween": "https://cdnjs.cloudflare.com/ajax/libs/tween.js/21.0.0/tween.esm.min.js",
          "three": "${templateUrl}/js/lib/threejs/three.module.js",
          "three/controls/OrbitControls": "${templateUrl}/js/lib/threejs/controls/OrbitControls.js",
          "three/loaders/DRACOLoader": "${templateUrl}/js/lib/threejs/loaders/DRACOLoader.js",
          "three/loaders/GLTFLoader": "${templateUrl}/js/lib/threejs/loaders/GLTFLoader.js",
          "three/loaders/RGBELoader": "${templateUrl}/js/lib/threejs/loaders/RGBELoader.js",
          "three/loaders/EXRLoader": "${templateUrl}/js/lib/threejs/loaders/EXRLoader.js",
          "three/postprocessing/EffectComposer": "${templateUrl}/js/lib/threejs/postprocessing/EffectComposer.js",
          "three/postprocessing/UnrealBloomPass": "${templateUrl}/js/lib/threejs/postprocessing/UnrealBloomPass.js",
          "three/postprocessing/RenderPass": "${templateUrl}/js/lib/threejs/postprocessing/RenderPass.js",
          "three/postprocessing/ShaderPass": "${templateUrl}/js/lib/threejs/postprocessing/ShaderPass.js",
          "three/shaders/GammaCorrectionShader": "${templateUrl}/js/lib/threejs/shaders/GammaCorrectionShader.js",
          "three/shaders/RGBShiftShader": "${templateUrl}/js/lib/threejs/shaders/RGBShiftShader.js",
          "three/shaders/FXAAShader": "${templateUrl}/js/lib/threejs/shaders/FXAAShader.js"
        }
      }
    `;
    document.head.appendChild(script3);

    const mainScript = document.createElement('script');
    mainScript.type = 'module';
    mainScript.src = `${templateUrl}/parts/${componentName}/script.js?key=${uniqueId}&templateUrl=${templateUrl}&model3d=${model3d}`;
    document.head.appendChild(mainScript);

    /**
     * Alert en caso que este un override y su rendimiento haya sido malo anteriormente.
     */
    try {
      let performanceCache = localStorage.getItem('performanceCache')
      ? JSON.parse(localStorage.getItem('performanceCache'))
      : {};

      if(performanceCache['override_scene_mode'] && performanceCache['override_scene_mode'] === '3D') {
        /**
         * Override (3D)
         */
        if( ((performanceCache[model3d] && performanceCache[model3d] === 'VERY_SLOW') || (performanceCache['global'] && performanceCache['global'] === 'VERY_SLOW')) ) {
          // const toastController = new Toast()
          // setTimeout(() => {
          //   toastController.render(`
          //   <div class="benchmark-toast-label" style="display: flex; align-items: center;">
          //     <svg fill="#ff0000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 478.125 478.125" xml:space="preserve">
          //       <g>
          //         <g>
          //           <g>
          //             <circle cx="239.904" cy="314.721" r="35.878"/>
          //             <path d="M256.657,127.525h-31.9c-10.557,0-19.125,8.645-19.125,19.125v101.975c0,10.48,8.645,19.125,19.125,19.125h31.9
          //               c10.48,0,19.125-8.645,19.125-19.125V146.65C275.782,136.17,267.138,127.525,256.657,127.525z"/>
          //             <path d="M239.062,0C106.947,0,0,106.947,0,239.062s106.947,239.062,239.062,239.062c132.115,0,239.062-106.947,239.062-239.062
          //               S371.178,0,239.062,0z M239.292,409.734c-94.171,0-170.595-76.348-170.595-170.596c0-94.248,76.347-170.595,170.595-170.595
          //               s170.595,76.347,170.595,170.595C409.887,333.387,333.464,409.734,239.292,409.734z"/>
          //           </g>
          //         </g>
          //       </g>
          //     </svg>
          //     <p style="margin-left: 10px;"> Tu dispositivo podría tener problemas de rendimiento corriendo la escena en 3D, habilita la 2D en caso de ir mal. </p>
          //   </div>
          // `)
          // }, 2000)
        }
      }
    } catch(e) {
      console.error('Error inesperado', e)
    }

    is3dLoaded = true
  }

  window.addEventListener('load', enable3d)
})