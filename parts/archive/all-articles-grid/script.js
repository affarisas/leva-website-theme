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
  const urlSearchParams = new URLSearchParams(window.location.search);
  const BACKEND_ACTION_NAME = 'load_more_posts'

  const parentEl = document.getElementById(uniqueId)
  
  const buttonLoadMore = parentEl.querySelector('#load_more');

  const searchContainer = parentEl.querySelector('div.search-container');
  const inputSearch = parentEl.querySelector('input#search');
  const buttonSearch = parentEl.querySelector('#search-button');

  /**
   * 3. Component logic
   * 
   * @description ↓↓↓↓↓↓↓ Todo el resto de la lógica irá abajo ↓↓↓↓↓↓↓
   */

  // lógica search
  // Obtener la URL base del template desde la URL del script actual
  const scriptUrl = document.currentScript.src;
  const templateUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/parts/'));
  const searchIconPath = `${templateUrl}/assets/img/parts/archive/all-articles-grid/magnifying-glass.svg`;
  const closeIconPath = `${templateUrl}/assets/img/parts/archive/all-articles-grid/close.svg`;

  // Función para actualizar el ícono según el valor del input
  function updateSearchIcon() {
    const img = buttonSearch.querySelector('img');
    if(inputSearch.value.trim() !== '') {
      img.src = closeIconPath;
      img.alt = 'Limpiar';
    } else {
      img.src = searchIconPath;
      img.alt = 'Buscar';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = new URL(window.location.href);
    if(currentUrl.searchParams.has('search')) {
      inputSearch.value = currentUrl.searchParams.get('search')
      updateSearchIcon(); // Actualizar ícono si hay búsqueda previa

      // Crear elemento 'a' que elimine el query string de 'search'
      const link = document.createElement('a')
      currentUrl.searchParams.delete('search')
      link.href = currentUrl.href
      link.textContent = 'Remover búsqueda'
      link.classList.add('remove-search')

      searchContainer.appendChild(link)
    }
  })

  // Actualizar ícono cuando el usuario escribe
  inputSearch.addEventListener('input', updateSearchIcon);

  // Manejar click en el botón (buscar o limpiar)
  buttonSearch.addEventListener('click', () => {
    const img = buttonSearch.querySelector('img');
    const searchValue = inputSearch.value.trim();
    
    // Si el ícono es la X (closeIconPath), limpiar el input
    if(img.src.includes('close.svg')) {
      inputSearch.value = '';
      updateSearchIcon();
      inputSearch.focus();
    } else if(searchValue !== '') {
      // Si hay valor y es el ícono de búsqueda, hacer búsqueda
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('search', searchValue);
      window.location.href = currentUrl.href;
    }
  })

  // Permitir búsqueda con Enter
  inputSearch.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
      const searchValue = inputSearch.value.trim();
      if(searchValue !== '') {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('search', searchValue);
        window.location.href = currentUrl.href;
      }
    }
  })

  // lógica botón 'Cargar más'
  function checkIfHideButtonLoadMore() {
    let current_page = parentEl.dataset.page;
    let max_pages = parentEl.dataset.max;
    if(current_page >= max_pages) {
      buttonLoadMore.style.visibility = 'hidden';
    }
  }; checkIfHideButtonLoadMore();

  buttonLoadMore.addEventListener('click', () => {
    let posts_container = parentEl.querySelector('.grid-articles-container');
    let current_page = parentEl.dataset.page;
    let max_pages = parentEl.dataset.max;
    let posts_per_page = parentEl.dataset.postsPerPage;
    let custom_post_type = parentEl.dataset.customPostType;

    if(current_page < max_pages) {
      let params = new URLSearchParams();
      params.append('action', BACKEND_ACTION_NAME);
      params.append('current_page', current_page);
      params.append('max_pages', max_pages);
      params.append('posts_per_page', posts_per_page);
      params.append('custom_post_type', custom_post_type);

      // para 'search':
      let queryStringSearch = urlSearchParams.get('search');
      if(queryStringSearch) params.append('s', queryStringSearch);

      // para 'cat':
      let category_id = parentEl.dataset.categoryId;
      if(category_id) params.append('category_id', category_id);
      console.log(category_id)

      axios.post('/wp-admin/admin-ajax.php', params).then(res => {
        let new_posts_charged = res.data.data;
        posts_container.innerHTML += new_posts_charged;
        parentEl.dataset.page = parseInt(parentEl.dataset.page) + 1;
        // if(parseInt(parentEl.dataset.page) >= parseInt(parentEl.dataset.max)) {
        //     jQuery('button.load_more').remove();
        // }
        // createPostThumbnail();
        checkIfHideButtonLoadMore()
      });
    } else {
      // @TODO
      console.log('No hay más posts para mostrar.')
    }
  });
})