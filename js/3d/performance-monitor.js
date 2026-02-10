/**
 * Description placeholder
 * @date 10/30/2023 - 1:10:09 AM
 *
 * @class PerformanceObserver
 * @typedef {PerformanceObserver}
 */

class PerformanceObserver {
  constructor(callback, minAcceptableFrametime = 33.3, badFrametime = 50) {
    this.callback = callback;
    this.minAcceptableFrametime = minAcceptableFrametime; // 33.3 -> 30FPS, 
    this.badFrametime = badFrametime;
    this.deltaTimes = [];
    this.lastTime = window.performance.now(); // Se usa para detectar el ultimo deltaTime cuando se hizo cuando se llamó el RAF
    this.startCounterTime = window.performance.now(); // Se usa para comenzar el conteo de hasta X segundos para parar el benchmark y hallar el promedio de frameTime.
    this.checking = false;
    this.performanceCache = localStorage.getItem('performanceCache')
      ? JSON.parse(localStorage.getItem('performanceCache'))
      : {};

    // Agrega event listeners para los eventos de visibilidad y blur
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    // window.addEventListener('blur', this.handleBlur.bind(this));
  }

  // Maneja el evento de cambio de visibilidad
  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      // El usuario cambió a otra pestaña o puso el navegador en segundo plano
      this.stopAndResetBenchmark();
    } else if(document.visibilityState === 'visible') {
      // Asegurarse de iniciar en el segundo 0 una vez el usuario ponga su página visible otra vez
      console.log('seteando this.lastTime')
      this.lastTime = window.performance.now();
      this.startCounterTime = window.performance.now();
      this.start();
    }
  }

  // // Maneja el evento blur
  // handleBlur() {
  //   // El usuario cambió a otra pestaña o puso el navegador en segundo plano
  //   this.resetPerformanceData();
  // }

  // Reinicia los datos de rendimiento
  stopAndResetBenchmark() {
    if (!this.checking) return;
    console.log('parando y flusheando...')
    this.deltaTimes = [];
    this.stop()
  }

  flushDeltas() {
    this.deltaTimes = [];
  }

  checkPerformance(sceneName) {
    // Modo: conteo en segundos (tramas variables, las que quepan en esos X segundos) 
    if (!this.checking) return;

    // Añadir deltatimes mientras esté dentro del rango de los 5 segundos
    const currentTime = performance.now();
    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.deltaTimes.push(deltaTime);

    // Calcula el tiempo transcurrido desde el inicio del período
    const elapsedTime = (currentTime - this.startCounterTime) / 1000; // En segundos

    if (elapsedTime >= 5) {
      // Una vez transcurren los 5 segundos
      const totalDeltaTimeSummary = this.deltaTimes.reduce((acc, curr) => acc + curr, 0);
      const averageDeltaTime = totalDeltaTimeSummary / this.deltaTimes.length;

      console.log(averageDeltaTime)

      if (averageDeltaTime > this.minAcceptableFrametime) {
        if(averageDeltaTime > this.badFrametime) {
          // si el rendimiento es menor a 20 fps
          // this.performanceCache['global'] = 'VERY_SLOW';
          this.performanceCache[sceneName] = 'VERY_SLOW';
          this.callback('VERY_SLOW');
        } else {
          // en caso de ser menor a 30 fps pero no menor a 20 fps se puede intentar optimizar la escena
          this.performanceCache[sceneName] = 'SLOW_BUT_ACCEPTABLE';
          this.callback('SLOW_BUT_ACCEPTABLE')
        }
      } else {
        this.performanceCache[sceneName] = 'FAST';
        this.callback('FAST');
      }

      localStorage.setItem('performanceCache', JSON.stringify(this.performanceCache));

      this.deltaTimes = []; // Reinicia el array para futuras muestras
      this.startCounterTime = currentTime; // Reinicia el contador de tiempo
    }
  }

  checkIfPerformanceCacheFlag(sceneName) {
    // if(this.performanceCache['global']) return this.performanceCache['global']; // rendimiento pesimo registrado en cache, deshabilitar 3d
    /* else */ return this.performanceCache[sceneName]; // tal vez es aceptable para optimizar la escena, dejar 3d
  }

  start() {
    console.log('starting from performance-monitor')
    this.lastTime = window.performance.now();
    console.log('seteando this.lastTime')
    this.startCounterTime = window.performance.now();
    this.checking = true;
  }

  stop() {
    console.log('stopping')
    this.checking = false;
  }
}