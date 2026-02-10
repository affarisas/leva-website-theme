# Documentación Técnica - Tema WordPress Leva

Este documento detalla la arquitectura, estructura de archivos, sistema de componentes y flujo de trabajo de desarrollo para el tema personalizado de WordPress "Leva" (basado en `movier-template`).

## 1. Visión General del Proyecto

El proyecto es un tema de WordPress desarrollado a medida que implementa una arquitectura basada en **Componentes (Parts)**. Esta arquitectura busca modularizar el desarrollo, manteniendo la lógica (PHP), el estilo (CSS/SCSS) y la interactividad (JS) de cada sección del sitio web encapsulados y organizados.

El tema está diseñado para integrarse estrechamente con **Advanced Custom Fields (ACF)**, utilizando principalmente campos de tipo "Flexible Content" para construir páginas dinámicas.

## 2. Estructura de Directorios

La estructura principal del tema es la siguiente:

```text
/leva-template
├── assets/             # Recursos estáticos (imágenes, modelos 3D, fuentes)
├── js/                 # Scripts globales y librerías (Three.js, etc.)
├── parts/              # DIRECTORIO PRINCIPAL DE COMPONENTES
│   ├── [categoria]/    # Agrupación lógica (ej: homepage, general)
│   │   ├── [nombre]/   # Carpeta del componente específico
│   │   │   ├── script.js     # Lógica JS específica del componente
│   │   │   ├── style.css     # Estilos compilados del componente
│   │   │   └── template.php  # Estructura HTML/PHP (ACF integration)
├── scss/               # Archivos fuente de estilos (Sass)
│   ├── global/         # Variables, mixins, resets globales
│   ├── modules/        # Estilos reutilizables (botones, tarjetas)
│   ├── parts/          # Espejo de la carpeta 'parts' para estilos SCSS
│   └── main.scss       # Punto de entrada para estilos globales
├── template_parts/     # Fragmentos de plantilla estándar de WP (loops, etc.)
├── compile-parts.js    # Script de Node.js para compilación selectiva de partes
├── create-part.js      # CLI para generar nuevos componentes (scaffolding)
├── functions.php       # Configuración del tema y hooks de WP
├── package.json        # Dependencias y scripts de NPM
└── style.css           # Hoja de estilos principal (global)
```

## 3. Arquitectura de Componentes (Parts)

El corazón del desarrollo reside en la carpeta `parts/`. Cada "part" representa un bloque de contenido reutilizable (probablemente un layout de Flexible Content en ACF).

### Estructura de un Componente

Cada componente se compone de tres archivos:

1.  **`template.php`**: Contiene el marcado HTML y la lógica PHP.
    *   Genera un **ID único** (`$component_key = uniqid();`) para aislar el componente.
    *   Carga dinámicamente su hoja de estilos específica (`style.css`).
    *   Utiliza `get_sub_field()` de ACF para poblar el contenido.
    *   Pasa variables (como el ID único) a los scripts JS mediante parámetros URL o atributos de datos.

    ```php
    <?php $component_key = uniqid(); ?>
    <link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/categoria/nombre/style.css">
    <section id="<?php echo $component_key; ?>" class="leva-component ...">
        <!-- Contenido ACF -->
    </section>
    <script src=".../script.js?key=<?php echo $component_key; ?>"></script>
    ```

2.  **`style.css`**: Estilos específicos del componente. **No se edita directamente**; es el resultado de la compilación del archivo SCSS correspondiente en `scss/parts/`.

3.  **`script.js`**: Lógica JavaScript encapsulada.
    *   Se recomienda obtener el ID único del componente (pasado como parámetro en el `src` del script) para seleccionar elementos solo dentro de esa instancia específica del componente, evitando conflictos si el componente se repite en la página.

## 4. Sistema de Estilos y Compilación (Sass)

El proyecto utiliza **Sass (SCSS)** como preprocesador CSS y tiene un flujo de compilación dual gestionado por `npm`.

### Scripts de NPM

El archivo `package.json` define los siguientes comandos clave:

*   **`npm run compile`**: Ejecuta en paralelo la compilación global y la de componentes (`compile:sass` y `compile:parts`).
*   **`npm run create`**: Ejecuta el asistente interactivo para crear un nuevo componente.

### Flujo de Compilación Detallado

1.  **Estilos Globales (`style.css`)**:
    *   **Fuente**: `scss/main.scss`
    *   **Destino**: `style.css` (raíz del tema).
    *   **Comando**: `sass --watch scss/main.scss style.css`
    *   **Uso**: Contiene reset, tipografía base, variables y estilos comunes que aplican a todo el sitio.

2.  **Estilos de Componentes (`parts/.../style.css`)**:
    *   **Fuente**: `scss/parts/[categoria]/[nombre]/style.scss`
    *   **Destino**: `parts/[categoria]/[nombre]/style.css`
    *   **Mecanismo**: El script `compile-parts.js` utiliza `chokidar` para observar cambios únicamente en la carpeta `scss/parts/`.
    *   **Lógica de Sobrescritura**:
        *   Cuando se modifica un archivo `.scss` en `scss/parts/`, el script detecta su ubicación.
        *   Calcula la ruta de destino basándose en la estructura de carpetas (debe coincidir exactamente).
        *   Compila ese archivo específico y sobrescribe el `style.css` dentro de la carpeta del componente correspondiente en `parts/`.
    *   **Ventaja**: Permite que cada componente cargue solo su propio CSS, mejorando el rendimiento (carga bajo demanda) y la modularidad.

## 5. Integración con ACF y Flexible Content

Para que un componente sea utilizable en el administrador de WordPress:

1.  Se debe crear un layout en un campo **Flexible Content** de ACF.
2.  El nombre del layout en ACF debe coincidir con el nombre de archivo o lógica de inclusión en los templates de página (ej: `page.php` o `functions.php`).
3.  Típicamente, se utiliza un bucle en PHP que recorre los layouts flexibles e incluye el archivo `template.php` correspondiente usando `include(locate_template('parts/...'))` o similar.

## 6. Flujo de Trabajo para el Desarrollador

### Crear un Nuevo Componente

No cree las carpetas manualmente. Utilice el script de automatización:

1.  Ejecute en la terminal:
    ```bash
    npm run create
    ```
2.  Siga las instrucciones:
    *   Ingrese el nombre del componente (ej: `hero-slider`).
    *   Seleccione una categoría existente o cree una nueva (ej: `homepage`).
3.  El script generará automáticamente:
    *   `parts/homepage/hero-slider/` con `template.php`, `style.css`, `script.js`.
    *   `scss/parts/homepage/hero-slider/style.scss`.

### Desarrollo

1.  Inicie el modo de desarrollo (compilación automática):
    ```bash
    npm start
    # O su equivalente: npm run compile
    ```
2.  Edite el archivo **SCSS** en `scss/parts/...` para dar estilos. **NO edite el CSS en la carpeta `parts`**, ya que será sobrescrito.
3.  Edite `template.php` para la estructura y campos ACF.
4.  Edite `script.js` para la interactividad.

### Depuración

*   Si los estilos de un componente no se actualizan, verifique que `npm run compile` esté corriendo y que no haya errores de sintaxis en el SCSS.
*   Asegúrese de que la estructura de carpetas en `scss/parts` sea un espejo exacto de `parts/`.
