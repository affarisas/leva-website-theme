/**
 * Carga de componentes
 * 
 * @description debido a la posibilidad de cargar componentes iguales, no basta con
 * un key único por componente, ya que el código declarará variables iguales. Habrá
 * una función genérica (registerComponent) que encapsulará la lógica de todos los
 * componentes, sin importar si son iguales o distintos.
 * 
 * @rule no se podrá usar la declaración 'var' de ninguna variable, o dará error de ejecución.
 * en su efecto se usará 'let' y 'const' para mantener el blocked-scope activo entre las lógicas.
 */

/**
 * @param {() => void} callback
 * @returns {() => void}
 */
function registerComponent(callback) {
  return callback()
}


/**
 * Description placeholder
 * @date 10/26/2023 - 12:07:13 AM
 *
 * @param {*} canvas
 * @param {'right' | 'left' | 'center'} position
 * @returns {{ onLoaded: () => void; }}
 */
function renderLoader(canvas, position, templateUrl){
  // let style = ""
  // if( position ==="left" ){
  //   style="justify-content: start; padding-left: 180px;"
  // }
  // else if( position === "right"){
  //   style=`justify-content: end; padding-right: 180px;`
  // }
  // else if( position === "center"){
  //   style=`justify-content: center;`
  // }

  // canvas.parentElement.innerHTML += `
  //   <div id="loaderElement3d" class="supercontainer-loader3dobjetc">
  //     <div style="`+ style+`" class="subcontainer-loader3dobjetc" style="background-color: azure;">
  //       <div class="scene-loader3dobjetc">
  //         <div class="cube-wrapper-loader3dobjetc">
  //           <div class="cube-loader3dobjetc">
  //             <div class="cube-faces-loader3dobjetc">
  //               <div class="cube-face-loader3dobjetc shadow-loader3dobjetc"></div>
  //               <div class="cube-face-loader3dobjetc bottom-loader3dobjetc"></div>
  //               <div class="cube-face-loader3dobjetc top-loader3dobjetc"></div>
  //               <div class="cube-face-loader3dobjetc left-loader3dobjetc"></div>
  //               <div class="cube-face-loader3dobjetc right-loader3dobjetc"></div>
  //               <div class="cube-face-loader3dobjetc back-loader3dobjetc"></div>
  //               <div class="cube-face-loader3dobjetc front-loader3dobjetc"></div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // `

  let isOpened = true

  if( position ==="left" ){
    style="align-items: start;"
  }
  else if( position === "right"){
    style=`align-items: end;`
  }
  else if( position === "center"){
    style=`align-items: center;`
  }

  canvas.parentElement.innerHTML += `
    <style>
      .loader {
        width: 65px;
        aspect-ratio: 1;
        position: relative;
      }
      .loader:before,
      .loader:after {
        content: "";
        position: absolute;
        border-radius: 50px;
        box-shadow: 0 0 0 3px inset var(--main-color);
        animation: l4 2.5s infinite;
      }
      .loader:after {
        animation-delay: -1.25s;
      }
      @keyframes l4 {
        0% {
          inset: 0 35px 35px 0;
        }
        12.5% {
          inset: 0 35px 0 0;
        }
        25% {
          inset: 35px 35px 0 0;
        }
        37.5% {
          inset: 35px 0 0 0;
        }
        50% {
          inset: 35px 0 0 35px;
        }
        62.5% {
          inset: 0 0 0 35px;
        }
        75% {
          inset: 0 0 35px 35px;
        }
        87.5% {
          inset: 0 0 35px 0;
        }
        100% {
          inset: 0 35px 35px 0;
        }
      }
    </style>
    <div id="loaderElement3d" class="supercontainer-loader3dobject ${position}" style="${style}">
      <div class="container-loader3dobject">
        <!-- prioritary donwload, dont use 'lazy' method here -->
        <!-- <img src="${templateUrl}/assets/img/loader.gif" alt="" class="img-loader3dobject"> -->
        <div class="scene-loader3dobjetc">
          <div class="loader"></div>
        </div>
        <div class="subcontainer-loader3dobject">
          <!-- <span class="loader"></span> -->
          <div> Iniciando </div>
        </div>
      </div>
    </div>
  `

  return {
    checkIfIsOpened: () => isOpened,
    onLoaded: function() {
      isOpened = false
      const loaderElement = document.getElementById("loaderElement3d")
      loaderElement.style.display = "none"
    },
    changeLoaderLabelState: function(state) {
      const labelElement = document.querySelector(".supercontainer-loader3dobject")
      labelElement.querySelector(".subcontainer-loader3dobject").innerHTML = `
        <!-- <span class="loader"></span> -->
        <div> ${state} </div>
      `
    }
  }
}

class Toast {
  constructor() {
    const div = document.createElement('div')
    const RANDOM_ID = () => '_' + Math.random().toString(36).substr(2, 9);
    this.randomId = RANDOM_ID()

    div.id = `${this.randomId}`
    div.className = 'movier-toast left'
    document.body.appendChild(div)

    this.toastElement = div
  }

  render(htmlString, timeout = 5000) {
    if (!this.toastElement) {
      console.error("El elemento #toast-component no se encuentra en el DOM.");
      return;
    }

    this.toastElement.innerHTML = htmlString;
    this.toastElement.style.display = 'flex';
    this.toastElement.style.opacity = 0;
    setTimeout(() => {
      this.toastElement.style.opacity = 1;
    }, 300);

    setTimeout(() => {
      this.toastElement.style.opacity = 0;
      setTimeout(() => {
        this.toastElement.style.display = 'none';
      }, 300);
    }, timeout)
  }

  hide() {
    if (this.toastElement) {
      this.toastElement.style.display = 'none';
    }
  }
}

/**
 * <img> Lazy Loading
 * @TODO use <img class="lazy" data-src""> instead <img src=""> to avoid load img by default.
 */
document.addEventListener("DOMContentLoaded", function() {
  let lazyloadImages;
  let options = {
      root: null,
      threshold: 0,
      rootMargin: '200px'
  }

  // Función para observar las imágenes
  function observeImages(images) {
    let imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    }, options);

    images.forEach(function(image) {
      imageObserver.observe(image);
    });
  }

  if ('IntersectionObserver' in window) {
    //Lazy load with Intersection Observer API
    lazyloadImages = document.querySelectorAll(".lazy");
    observeImages(lazyloadImages);

    // Observa los cambios en el DOM
    let observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          let newImages = mutation.target.querySelectorAll(".lazy");
          observeImages(newImages);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    //Lazy load with scroll event listener
    //Supports < IE v11
    let lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll(".lazy");
    
    function lazyload () {
      if(lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }    

      lazyloadThrottleTimeout = setTimeout(function() {
        let scrollTop = window.pageYOffset;

        lazyloadImages.forEach(function(img) {
          if(img.offsetTop < (window.innerHeight + scrollTop)) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
          }
        });

        if(lazyloadImages.length == 0) { 
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }
})