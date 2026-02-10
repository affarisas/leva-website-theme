### ¿Por qué nos tocó crear un CPT de '/servicio' y '/trabajo' en vez de '/servicios' y '/trabajos', y apuntar '/servicios' + '/trabajos' a una página normal?

Crear un CPT permite modificar sus singles desde el editor de administración, pero sus archives no. Se debe poder acceder de manera <strong> obligatoria </strong> al editor de administración para sus archives también,<strong> ya que se deben cargar los componentes ACF ahí</strong>.

### ¿Por qué la página 'Blog' ya no está configurada en Menu -> Lectura como página de entradas, y me vi forzado a crear un CPT 'Blog'?

Porque parece que hay un problema en cargar los componentes ACF dentro de la página 'Blog' (tanto el archive como el single no cargan) debido a que WP_Query puede que funcione distinto debido a que son pertenecientes a la familia WP_Core. Una vez esté configurada la página como 'Página de entradas' predeterminada por WordPress.


## Esqueleto básico para registro de componente en JavaScript

```javascript
registerComponent(() => {
  /**
   * 1. Key
   * 
   * @description Obtener el ID del key generado desde PHP extrayendo el src="" único de este script invocado.
   */
  const srcScript = new URL(document.currentScript.src); // (All browser support except IE).
  const queryParams = new URLSearchParams(srcScript.search);
  const uniqueId = queryParams.get('key');

  /**
   * 2. Global (component-scope) variables
   * 
   * @description Crear controles y lógica sólo para el contenedor con el id único
   */
  const parentEl = document.getElementById(uniqueId)

  /**
   * 3. Component logic
   * 
   * @description ↓↓↓↓↓↓↓ Todo el resto de la lógica irá abajo ↓↓↓↓↓↓↓
   */
  
  // ...
})
```