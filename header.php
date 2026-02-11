<!-- Special attributions for multiple models used in https://sketchfab.com/ and grabcad.com

* This model inspired me into creating a similar electric box*
User: Bekir Ardıç Gücüyener, link: https://grabcad.com/bekir.ardic.gucuyener-1
https://grabcad.com/library/electrical-panel-17

User: vasfid, link: https://sketchfab.com/vasfid
https://sketchfab.com/3d-models/fast-charging-station-95c8191efcf24e62af048cf9b9f22696

User: ming_he, link: https://sketchfab.com/ming_he
https://sketchfab.com/3d-models/byd-yinyang-concept-351f62737e154ec0ab89c10dc912a73e

User: ar6116680122, link: https://sketchfab.com/ar6116680122
https://sketchfab.com/3d-models/ar315-condominium-45855a0e353a4f0f9f4c75076cf09657

User: rubiez, link: https://sketchfab.com/rubiez
https://sketchfab.com/3d-models/flir-e5-c5c37e8cd607424fbdb06c7ae2924924

User: Kami Rapacz, link: https://sketchfab.com/kuroderuta
https://sketchfab.com/3d-models/document-clipboard-with-pen-8650234a2e7949ca9fe9b4124e000d97

User: Davide Specchi, link: https://sketchfab.com/Davide.Specchi
https://sketchfab.com/3d-models/apple-desktop-09e39508a9a34d4e8f9ffbbf7189aaa4

User: Nol22, link: https://sketchfab.com/manoloescobedo22
https://sketchfab.com/3d-models/construction-helmet-83743fb594274f75965cb71ca0730d75

User: krishanu.d007, link: https://sketchfab.com/krishanu.d007
https://sketchfab.com/3d-models/vintage-electric-glass-light-bulb-15f34dfc8d024122b2a849e65b425709
-->

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="<?php echo esc_url(get_template_directory_uri()); ?>/assets/img/leva-a-logo.svg" type="image/svg+xml">
    <?php wp_head(); ?>

    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-P9GFDD4R');</script>
    <!-- End Google Tag Manager -->

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-KB9V9547M7"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-KB9V9547M7');
    </script>

    <!-- Script y Style globales -->
    <link href="<?php bloginfo('stylesheet_url'); ?>" rel="stylesheet"/>
    <script src="<?php bloginfo('template_url'); ?>/js/index.js"></script>

    <link rel="icon" href="<?php echo esc_url(get_template_directory_uri()); ?>/assets/img/leva-a-logo.svg" type="image/svg+xml">

    <!-- Script de librerías -->
    <?php
      if(is_page('blogs')) { ?>
        <script src="<?php bloginfo('template_url'); ?>/js/lib/axios.min.js"></script>
      <?php
      }
    ?>

    <!-- Start of HubSpot Embed Code -->
    <script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/139702754.js"></script>
    <!-- End of HubSpot Embed Code -->

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- DM Sans font-family -->
    <!-- <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Roboto:ital,wdth,wght@0,90,100..900;1,90,100..900&display=swap" rel="stylesheet"> -->
     <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Roboto:ital,wdth,wght@0,88,100..900;1,88,100..900&display=swap" rel="stylesheet">
  </head>

  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P9GFDD4R"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <header>
      <div class="lock__ui">
        <a class="logo" href="<?php echo esc_url(get_home_url()); ?>">
          <img class="lazy" data-src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/img/leva-logo.svg" alt="logo Leva"/>
        </a>

        <label for="menu-btn" class="menu-icon">
          <span class="navicon"></span>
        </label>
        <input type="checkbox" class="menu-btn" id="menu-btn"/>

        <div class="nav-supercontainer" id="nav-menu-container">
          <?php
          class Custom_Walker_Nav_Menu extends Walker_Nav_Menu {
            function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
              $classes = empty($item->classes) ? array() : (array) $item->classes;
              
              // Detectar si es la página actual
              if (in_array('current-menu-item', $classes) || 
                  in_array('current_page_item', $classes) ||
                  in_array('current-menu-ancestor', $classes)) {
                $classes[] = 'active';
              }
              
              $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
              $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';
              
              $output .= '<li' . $class_names . '>';
              
              $atts = array();
              $atts['href'] = !empty($item->url) ? $item->url : '';
              $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args, $depth);
              
              $attributes = '';
              foreach ($atts as $attr => $value) {
                if (!empty($value)) {
                  $attributes .= ' ' . $attr . '="' . esc_attr($value) . '"';
                }
              }
              
              $title = apply_filters('the_title', $item->title, $item->ID);
              
              $item_output = $args->before;
              $item_output .= '<a' . $attributes . '>';
              $item_output .= $args->link_before . $title . $args->link_after;
              $item_output .= '</a>';
              $item_output .= $args->after;
              
              $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
            }
          }
          
          wp_nav_menu(array(
            'theme_location' => 'primary',
            'menu' => 'nav_main',
            'container' => 'nav',
            'container_class' => 'main-navigation',
            'walker' => new Custom_Walker_Nav_Menu()
          ));
          ?>
          <button class="fill primary only-mobile" onclick="window.location.href='<?php echo esc_url(get_home_url()); ?>/contacto'">
            Contáctanos
          </button>
        </div>
        <button class="fill primary only-desktop" onclick="window.location.href='<?php echo esc_url(get_home_url()); ?>/contacto'">
          Contáctanos
        </button>
      </div>
    </header>

    <script>
      document.addEventListener('click', function(event) {
        const menuBtn = document.getElementById('menu-btn');
        const navContainer = document.getElementById('nav-menu-container');
        const menuIcon = document.querySelector('.menu-icon');

        // Only execute if menu is open (checked) and screen is mobile (navContainer is visible/styled as mobile)
        if (menuBtn && menuBtn.checked) {
          // Check if click was outside the nav container AND outside the toggle button
          if (!navContainer.contains(event.target) && !menuIcon.contains(event.target) && event.target !== menuBtn) {
            menuBtn.checked = false;
          }
        }
      });
    </script>