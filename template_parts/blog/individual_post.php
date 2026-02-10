<?php
/**
 * Carga individual x artículo cuando se hace una petición a la acción 'wp_ajax_load_more_posts'
 */

$categorias = get_the_terms(get_the_ID(), 'category'); ?>
<a href="<?php echo get_permalink(); ?>" class="basic-card">
  <div class="thumbnail-container">
    <?php if(has_post_thumbnail()) :
      $thumbnail_id = get_post_thumbnail_id();
      $thumbnail_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
      $thumbnail_title = get_the_title($thumbnail_id);
      $thumbnail_src = wp_get_attachment_image_src($thumbnail_id, 'large')[0];
  
      echo '<img class="lazy" data-src="' . $thumbnail_src . '" alt="' . $thumbnail_alt . '" title="' . $thumbnail_title . '">';
    endif ?>
  </div>
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
  <h5 class="card-title"><?php the_title(); ?></h5>
</a>