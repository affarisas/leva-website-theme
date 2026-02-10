<?php // backend
  add_theme_support('post-thumbnails');
  /**
   * ------------- Enable the_excerpt support ------------------
   */
  function wpdocs_custom_init() {
    // add_post_type_support( 'my-custom-post-type', 'excerpt' );
    add_post_type_support( 'servicio', 'excerpt' );
    add_post_type_support( 'trabajo', 'excerpt' );
  }
  add_action('init', 'wpdocs_custom_init');

  // Deshabilitar los logs en WordPress (comentar las 6 líneas siguientes si deseas ver los errores en la página)
  // ini_set('log_errors','On');
  // ini_set('display_errors','Off');
  // ini_set('error_reporting', E_ALL );
  // define('WP_DEBUG', false);
  // define('WP_DEBUG_LOG', true);
  // define('WP_DEBUG_DISPLAY', false);

  function leva_register_menus() {
    register_nav_menus(array(
      'primary' => __('Menú Principal', 'leva'),
    ));
  }
  add_action('init', 'leva_register_menus');

  /**
   * ------------------------------------------- AJAX actions ----------------------------------------------
   */
  // charge posts content on /blog
  add_action('wp_ajax_nopriv_load_more_posts', 'loadMorePosts'); // 'wp_ajax_nopriv_...' is a reserved phrase
  add_action('wp_ajax_load_more_posts', 'loadMorePosts'); // 'wp_ajax_...' is a reserved phrase

  function loadMorePosts() {
    $next_page = $_POST['current_page'] + 1;
    $search_str = $_POST['s'];
    $posts_per_page = intval($_POST['posts_per_page']);
    $category_id = $_POST['category_id'];
    $custom_post_type = $_POST['custom_post_type'];

    $args = array(
      'post_type' => $custom_post_type,
      'posts_per_page' => $posts_per_page,
      'paged' => $next_page,
      'orderby' => 'date',
      'order' => 'DESC',
    );

    // filters
    if($search_str !== null) { $args['s'] = $search_str; }
    if($category_id !== null) { $args['cat'] = $category_id; }

    $query = new WP_Query($args);
    
    if($query->have_posts()) :
      ob_start();
      while ($query->have_posts()) : $query->the_post();
      get_template_part('template_parts/blog/individual_post');
      endwhile;
      wp_send_json_success(ob_get_clean());
    else:
      wp_send_json_error('');
    endif;
  }
?>