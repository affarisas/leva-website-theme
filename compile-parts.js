const fs = require('fs');
const path = require('path');
const sass = require('sass');
const chokidar = require('chokidar');

const scssDir = path.join(__dirname, 'scss', 'parts');

const compileSection = (scssFileModified) => {
  /**
   * Suponemos que este es el archivo que ha sido modificado (scssFileModified):
   * -> 'D:\xampp\htdocs\wp-content\themes\movier-template\scss\parts\homepage\hero\style.scss'
   */
  // 1. obtener el nombre y la categoria (en este caso 'hero' y 'homepage' respectivamente) 
  const splitScssDir = scssFileModified.split('\\')
  let name = splitScssDir[splitScssDir.length - 2]
  let category = splitScssDir[splitScssDir.length - 3]
  
  // 2. construir el directorio style.css del /part al que se va a renderizar el scss victima
  const targetDir = path.join(__dirname, 'parts', category, name, 'style.css')

  // 3. checkear que el archivo destino (style.css de /parts) exista
  if(fs.statSync(scssFileModified).isFile()) {
    // 4. transpilar
    const content = fs.readFileSync(scssFileModified, 'utf-8');
    sass.render({
      data: content
    }, (e, res) => {
      if(!e) {
        try {
          fs.writeFileSync(targetDir, res.css);
          console.log(`scss/parts/${category}/${name}/style.scss transpilado`)
        } catch(e) {
          console.error('Error en fs.writeFileSync:', e)
        }
      } else { console.error(e) };
    })
  } else {
    console.log('El archivo destino .css no existe. Recuerda que se debe respetar la misma estructura de archivo para lograr cometer el transpilado.')
  }
};

// Comenzar a escuchar todos los archivos dentro de scss/parts
const watcher = chokidar.watch(scssDir, { ignoreInitial: true });
watcher.on('add', compileSection);
watcher.on('change', compileSection);

console.log('Escuchando cambios en ./scss/parts/*...');

// Stop watching on process exit
process.on('exit', () => {
  watcher.close();
});