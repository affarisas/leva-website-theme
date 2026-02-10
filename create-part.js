const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const createPart = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'partName',
      message: "Introduce el nombre del nuevo 'part':"
    }
  ]);

  const { partName } = answers;

  const basePartDir = path.join(__dirname + '\\parts')
  const baseScssDir = path.join(__dirname + '\\scss' + '\\parts')

  const categories = fs.readdirSync(basePartDir); // Lee las carpetas en el mismo nivel del directorio

  const categoryChoices = [...categories, 'Crear nueva categoría'];

  const categoryAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedCategory',
      message: 'Selecciona una categoría:',
      choices: categoryChoices
    }
  ]);

  let selectedCategory = categoryAnswer.selectedCategory;

  if (selectedCategory === 'Crear nueva categoría') {
    const newCategoryAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'newCategory',
        message: 'Introduce el nombre de la nueva categoría:'
      }
    ]);

    selectedCategory = newCategoryAnswer.newCategory;

    // 1. Crear parts/NUEVA_CATEGORIA
    fs.mkdirSync(path.join(basePartDir, selectedCategory));
    // 2. Crear scss/parts/NUEVA_CATEGORIA
    fs.mkdirSync(path.join(baseScssDir, selectedCategory));
  }

  // Dentro de 'parts':
  const partDirectory = path.join(basePartDir, selectedCategory, partName);
  fs.mkdirSync(partDirectory); // Crea la carpeta del 'part'

  // Crea los archivos CSS, PHP y JS dentro del 'part'
  const filesToCreate = ['style.css', 'script.js', 'template.php'];
  filesToCreate.forEach(filename => {
    fs.writeFileSync(path.join(partDirectory, filename), '', 'utf-8');
  });

  // Dentro del 'scss':
  // 1. Crear scss/parts/NUEVA_CATEGORIA/NUEVO_NAME
  fs.mkdirSync(path.join(baseScssDir, selectedCategory, partName));
  // 2. Crea los archivos CSS, PHP y JS dentro de scss/parts/NUEVA_CATEGORIA/NUEVO_NAME
  const scssDirectory = path.join(baseScssDir, selectedCategory, partName);
  fs.writeFileSync(path.join(scssDirectory, 'style.scss'), '', 'utf-8');

  console.log(`Part "'${partName}'" creado en la categoría "'${selectedCategory}'".`);
};

createPart();
