<!-- < Key generate > -->
<?php $component_key = uniqid(); ?>
<!-- < Styling > -->
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/archive/all-articles-grid/style.css">
<!-- < Component > -->
<?php
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

  $category_id_selected = 0;
  $category_blogs_parent_id = 13;
  $category_trabajos_parent_id = 5;
  // $category_servicios_parent_id = 10;
  
  // 1. traer el id de la categoría (acordarse que en plural son las categorías de WP_Core, y las CPT son en singular)
  if(strcmp(get_sub_field('category'), 'blog') === 0) $category_id_selected = get_cat_ID('blogs');
  else if(strcmp(get_sub_field('category'), 'trabajo') === 0) $category_id_selected = get_cat_ID('trabajos');

  $posts_per_page = 11;
  $args = array(
    'post_type' => get_sub_field('category'), // Tipo de publicación (puede variar)
    'posts_per_page' => $posts_per_page, // Mostrar todas las entradas
    'orderby' => 'date', // Ordenar por fecha
    'order' => 'DESC', // En orden descendente (de las más recientes a las más antiguas)
  );

  // 's' query string
  $url_search = isset($_GET['search']) ? $_GET['search'] : null;
  if($url_search) {
    // 's' exists in url
    $args['s'] = $url_search;
  }

  $url_cat = isset($_GET['cat']) ? $_GET['cat'] : null;
  if($url_cat) {
    $term = get_category_by_slug($url_cat);
    if ($term) {
        $args['cat'] = $term->term_id;
    }
  }

  // Mostrar recientes automáticamente cuando no hay búsquedas ni filtros
  $show_recents = empty($url_search) && empty($url_cat);

  $grid_args = $args;

  if($show_recents) {
    $recents_args = $args;
    $recents_args['posts_per_page'] = 4;
    $recents_query = new WP_Query($recents_args);

    $grid_args['offset'] = 4;
  }

  $query = new WP_Query($grid_args);

?>
  <section class="leva-component all-articles-grid <?php echo get_sub_field('category'); ?>"
    id="<?php echo $component_key; ?>"
    data-custom-post-type="<?php echo get_sub_field('category'); ?>"
    data-category-id="<?php echo ($cat = get_category_by_slug($url_cat)) ? $cat->term_id : ''; ?>"
    data-posts-per-page="<?php echo $posts_per_page; ?>"
    data-page="<?= get_query_var('paged') ? get_query_var('paged') : 1; ?>"
    data-max="<?= $query->max_num_pages; ?>"
  >
    <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/a-logo-as-bg.svg" class="a-logo-watermark" alt="Logo">
    <h1 style="text-align: center; margin-top: 50px; z-index: 1;"> Blog </h1>
    <p style="text-align: center; color: var(--neutral-500); z-index: 1;"> Proveemos tips, recursos y noticias de la industria que te ayudarán, ¿por qué no le echas un vistazo? </p>
    <div class="lock__ui">
      <div class="sidebar">
        <div class="search-container">
          <div class="search">
            <input type="search" name="search" id="search" placeholder="Buscar" />
            <span id="search-button"><img src="<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/magnifying-glass.svg" alt="Buscar"></span>
          </div>
        </div>
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

                    if($url_cat && strcmp($url_cat, $category->slug) === 0) {
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
      </div>
      <div class="content-articles">
        <?php if($show_recents && isset($recents_query) && $recents_query->have_posts()) : ?>
          <h2>Recientes</h2>
          <div class="recent-articles">
            <?php
              $recent_index = 0;
              while($recents_query->have_posts()) : $recents_query->the_post();
                $recent_index++;
                $categorias = get_the_terms(get_the_ID(), 'category');
                $has_thumbnail = has_post_thumbnail();
                $thumbnail_id = $has_thumbnail ? get_post_thumbnail_id() : null;
                if($has_thumbnail) {
                  $thumbnail_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
                  $thumbnail_title = get_the_title($thumbnail_id);
                  $thumbnail_src = wp_get_attachment_image_src($thumbnail_id, 'large')[0];
                }
                $card_class = $recent_index === 1 ? 'feature-card-horizontal' : 'feature-card-vertical';
            ?>
              <a href="<?php echo get_permalink(); ?>" class="basic-card blog-grid-card <?php echo $card_class; ?>">
                <div class="thumbnail-container<?php echo $has_thumbnail ? '' : ' no-thumbnail'; ?>">
                  <?php if($has_thumbnail) {
                    echo '<img class="lazy" data-src="' . $thumbnail_src . '" alt="' . $thumbnail_alt . '" title="' . $thumbnail_title . '">';
                  } else { ?>
                    <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/picture.svg" alt="<?php the_title(); ?>">
                  <?php } ?>
                </div>
                <div class="content-info">
                  <div class="categories">
                    <?php
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
                  <h5 class="card-title"><?php the_title(); ?></h5>
                  <p class="card-excerpt"><?php echo get_the_excerpt(); ?></p>
                  <div class="meta-row">
                    <div class="meta-avatar-container">
                      <img class="meta-avatar" src="<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/a-avatar.svg" alt="<?php echo get_the_author(); ?>">
                    </div>
                    <div style="display: flex; flex-direction: column;">
                      <span class="meta-author"><?php echo get_the_author(); ?></span>
                      <span class="meta-date"><?php echo get_the_date(); ?></span>
                    </div>
                  </div>
                </div>
              </a>
            <?php endwhile; ?>
          </div>
        <?php endif; ?>
        <h2><?php echo (empty($url_cat) && empty($url_search) ? 'Todos los artículos' : 'Artículos filtrados') ?></h2>
        <div class="grid-articles-container">
          <?php
          while ($query->have_posts()) : $query->the_post();
          $categorias = get_the_terms(get_the_ID(), 'category');
          $has_thumbnail = has_post_thumbnail();
          $thumbnail_id = $has_thumbnail ? get_post_thumbnail_id() : null;
          if($has_thumbnail) {
            $thumbnail_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
            $thumbnail_title = get_the_title($thumbnail_id);
            $thumbnail_src = wp_get_attachment_image_src($thumbnail_id, 'large')[0];
          }
          ?>
            <a href="<?php echo get_permalink(); ?>" class="basic-card blog-grid-card">
              <div class="thumbnail-container<?php echo $has_thumbnail ? '' : ' no-thumbnail'; ?>">
                <?php if($has_thumbnail) {
                  echo '<img class="lazy" data-src="' . $thumbnail_src . '" alt="' . $thumbnail_alt . '" title="' . $thumbnail_title . '">';
                } else { ?>
                  <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/picture.svg" alt="<?php the_title(); ?>">
                <?php } ?>
              </div>
              <div class="content-info">
                <div class="categories">
                  <?php
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
                    }
                  ?>
                </div>
                <h5 class="card-title"><?php the_title(); ?></h5>
                <p class="card-excerpt"><?php echo get_the_excerpt(); ?></p>
                <div class="meta-row">
                  <div class="meta-avatar-container">
                    <img class="meta-avatar" src="<?php bloginfo('template_url'); ?>/assets/img/parts/archive/all-articles-grid/a-avatar.svg" alt="<?php echo get_the_author(); ?>">
                  </div>
                  <div style="display: flex; flex-direction: column;">
                    <span class="meta-author"><?php echo get_the_author(); ?></span>
                    <span class="meta-date"><?php echo get_the_date(); ?></span>
                  </div>
                </div>
              </div>
            </a>
          <?php endwhile ?>
        </div>
        <button class="fill primary" id="load_more">Cargar más</button>
      </div>
    </div>
  </section>
<?php
  wp_reset_postdata();
?>
<!-- < Script > -->
<script src="<?php bloginfo('template_url'); ?>/parts/archive/all-articles-grid/script.js?key=<?php echo $component_key; ?>"></script>
