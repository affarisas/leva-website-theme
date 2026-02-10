<?php 
get_header();

function strip_param_from_url( $url, $param ) {
	$base_url = strtok($url, '?');              // Get the base url
	$parsed_url = parse_url($url);              // Parse it 
	$query = $parsed_url['query'];              // Get the query string
	parse_str( $query, $parameters );           // Convert Parameters into array
	unset( $parameters[$param] );               // Delete the one you want
	$new_query = http_build_query($parameters); // Rebuilt query string
	if(strcmp($new_query, '') === 0) {          // 1: no query string
		return $base_url;                         // Return URL without query string
	} else {                                    // 2: has query string
		return $base_url.'?'.$new_query;          // Return URL with query string
	}
}
?>

<!-- BLOG SINGLE SCREEN -->
<?php 
  // Obtener el custom post type del actual post
  $category_id_selected = get_cat_ID('blogs');
  $current_post_id = get_the_id();

  /**
   * Preparación de WP_Query
   */
  $posts_per_page = 11;
  $args = array(
    'post_type' => 'blog', // Tipo de publicación (puede variar)
    'posts_per_page' => $posts_per_page, // Mostrar todas las entradas
    'orderby' => 'date', // Ordenar por fecha
    'order' => 'DESC', // En orden descendente (de las más recientes a las más antiguas)
  );

  $query = new WP_Query($args);
?>
<section class="leva-component single-section-blog">
  <?php while (have_posts()) : the_post(); $post_id = get_the_ID(); ?>
  <span class="category"> <?php echo get_the_category($post_id)[0]->name; ?> </span>
  <h1 class="entry-title light_theme"> <?php echo get_the_title($post_id); ?> </h1>
  <div class="lock__ui">
    <div class="sidebar">
      <div class="search-container">
        <div class="search">
          <input type="search" name="search" id="search" placeholder="Buscar" />
          <span id="search-button"><img src="<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/magnifying-glass.svg" alt="Buscar"></span>
        </div>
      </div>
      <script>
        const inputSearch = document.querySelector('input#search');
        const buttonSearch = document.querySelector('#search-button');
        const searchIconPath = "<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/magnifying-glass.svg";
        const closeIconPath = "<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/close.svg";
        
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

        // Evento para actualizar el ícono al escribir en el input
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
            // la url debera ser /blog/?search=xxx
            const baseUrl = "<?php echo home_url('/blog'); ?>";
            const currentUrl = new URL(baseUrl);
            currentUrl.searchParams.set('search', searchValue);
            window.location.href = currentUrl.href;
          }
        })

        // Permitir búsqueda con Enter
        inputSearch.addEventListener('keypress', (e) => {
          if(e.key === 'Enter') {
            const searchValue = inputSearch.value.trim();
            if(searchValue !== '') {
              const baseUrl = "<?php echo home_url('/blog'); ?>";
              const currentUrl = new URL(baseUrl);
              currentUrl.searchParams.set('search', searchValue);
              window.location.href = currentUrl.href;
            }
          }
        })
      </script>
      <div class="content">
        <h5>Categorias</h5>
        <ul>
          <?php
            /**
             * Sidebar: categorías
             * Desplegar lista de categorías a partir de una padre
             */
            $args = array('parent' => $category_id_selected);
            $categories = get_categories($args);
            foreach($categories as $category) { ?>
              <li>
                <a href="<?php 
                  $url = home_url( add_query_arg( NULL, NULL ) );
                  
                  if(strpos($url, 'cat') !== false) {
                    // 'cat' query string found in url
                    
                    $url = strip_param_from_url( $url, 'cat' ); // 1. remove query string first
                    // 2. rebuild url with new query string
                    if(strpos($url, '?')) {
                      $query_string = '&';
                    } else {
                      $query_string = '?';
                    }
                    $query_string .= 'cat='.$category->slug;
                    $url .= $query_string; // ?cat=xxx || &cat=xxx
                  } else {
                    // 'cat' query string not found in url

                    if(strpos($url, '?')) {
                      $query_string = '&';
                    } else {
                      $query_string = '?';
                    }
                    $query_string .= 'cat='.$category->slug;
                    $url .= $query_string; // ?cat=xxx || &cat=xxx
                  }

                  echo $url;
                ?>"> <?php echo $category->name; ?> </a>
                <?php
                  /**
                   * renderizar 'X' en la categoría específica (si existe ?cat=, buscará cual coincide comparando uno a uno, su slug)
                   */

                  if(isset($_GET['cat']) && strcmp($_GET['cat'], $category->slug) === 0) {
                    // Hay una categoría filtrándose desde el URL (?cat=), y coincide con el slug de la categoría: poner X ?>
                    <a href="<?php
                    $url = home_url( add_query_arg( NULL, NULL ) );

                    if(strpos($url, 'cat') !== false) {
                      // 'cat' query string found in url
                      $url = strip_param_from_url( $url, 'cat' );
                    }
                    echo $url;
                    ?>">
                      <span class="material-symbols-outlined close">
                        close
                      </span>
                    </a>
                    <?php
                  }
                ?>
              </li>
            <?php
            }
          ?>
        </ul>
      </div>
      <?php
        /**
         * Sidebar: artículos recientes
         */
        if(empty($url_cat) && empty($url_search)) {
          // para mostrar los últimos artículos no debe estar filtrándose por search o cat, debido a que se mostrarán acá también los artículos filtrados, no los globales.
          // tampoco se puede hacer un WP_Query acá, debido a que hay uno arriba abierto que no se ha cerrado (wp_reset_postdata) y generará conflictos. ?>
          <div class="content">
            <h5>Últimos artículos</h5>
            <ul class="list-recent">
              <?php
                if ($query->have_posts()) {
                  $i = 0;
                  while ($query->have_posts()) : $query->the_post();
                    if($i < 5) {
                      $categorias = get_the_terms(get_the_ID(), 'category'); ?>
                    <li>
                      <a href="<?php echo get_permalink(); ?>" class="list-recent">
                        <div class="content-info">
                          <div class="categories">
                            <?php
                            // Mostrar las categorías del post
                            if($categorias) {
                              $total_categorias = count($categorias);
                              $contador = 0;
                              $text_categorias = '';
                              foreach($categorias as $categoria) {
                                $contador++;
                                $text_categorias = $text_categorias . ($categoria->name . '' . ($contador < $total_categorias ? ',' : ''));
                              }
                              ?>
                                <span class="category">
                                  <?php echo $text_categorias; ?>
                                </span>
                              <?php
                            } else { ?>
                              <span class="category">
                                <?php echo 'Sin categoría'; ?>
                              </span>
                            <?php
                            } ?>
                          </div>
                          <h3 class="card-title"><?php the_title(); ?></h3>
                          <div class="data-row">
                            <p class="author">Autor: <?php echo get_the_author(); ?></p>
                            <p class="date"><?php echo get_the_date(); ?></p>
                          </div>
                        </div>
                      </a>
                    </li>
                  <?php
                  }
                  $i++;
                endwhile;
                } else {
                  echo '<li style="font-size: 14px;">No hay artículos recientes.</li>';
                }
              ?>
            </ul>
          </div>
        <?php
        }
      wp_reset_postdata(); ?>
    </div>
    <div class="single-post-detail">
        <div class="article-extra-info">
          <p>
            <span style="font-weight: bold;">Última actualización:</span> <?php echo get_the_date('', $post_id); ?>
          </p>
          <p class="author">
            <span style="font-weight: bold;">Autor:</span> <?php
            $author_id = get_post_field('post_author', $post_id);
            echo get_the_author_meta('display_name', $author_id); ?>
          </p>
        </div>
        <?php $post = get_post($post_id); setup_postdata($post); ?>
        <div class="thumbnail-container">
          <?php if(has_post_thumbnail()) {
            $thumbnail_id = get_post_thumbnail_id();
            $thumbnail_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
            $thumbnail_title = get_the_title($thumbnail_id);
            $thumbnail_src = wp_get_attachment_image_src($thumbnail_id, 'large')[0];
        
            echo '<img class="lazy" data-src="' . $thumbnail_src . '" alt="' . $thumbnail_alt . '" title="' . $thumbnail_title . '">';
          } else { ?>
            <img class="no-image" src="<?php echo get_template_directory_uri(); ?>/assets/img/parts/archive/all-articles-grid/picture.svg" alt="No image">
          <?php
          } ?>
        </div>
        <div class="entry-content" style="margin-top: 25px;">
            <div class="entry-description">
                <?php echo apply_filters('the_content', get_the_content(null, false, $post_id)); ?>
            </div>
        </div>
      <?php endwhile; ?>
    </div>
  </div>
</section>
<?php 
  get_footer(); 
?> 