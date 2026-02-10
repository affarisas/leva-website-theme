<?php $component_key = uniqid(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/nosotros/hero/style.css">
<section class="leva-component part-nosotros-hero-section" id="<?php echo $component_key; ?>">
  <div class="lock__ui">
    <div class="header-container">
      <h2><?php echo get_sub_field('title'); ?></h2>
      <p class="description"><?php echo get_sub_field('description'); ?></p>
    </div>
    <div class="img-container">
      <?php $imagen = get_sub_field('imagen_intro'); ?>
      <?php if( $imagen ): ?>
        <img src="<?php echo $imagen; ?>" alt="<?php echo $imagen; ?>">
      <?php endif; ?>
    </div>
    <div class="timeline-vertical-story">
      <?php if( have_rows('historia-secciones') ): ?>
        <?php while( have_rows('historia-secciones') ): the_row();
          $orientacion = get_sub_field('orientacion');
          $descripcion = get_sub_field('descripcion');
          $imagen = get_sub_field('imagen');
        ?>
          <div class="timeline-vertical-story-item <?php echo $orientacion; ?>">
            <p><?php echo $descripcion; ?></p>
            <div class="divider"></div>
            <div class="img-container">
              <?php if( $imagen ): ?>
                <img src="<?php echo $imagen['url']; ?>" alt="<?php echo $imagen['alt']; ?>">
              <?php endif; ?>
            </div>
          </div>
        <?php endwhile; ?>
      <?php endif; ?>
    </div>
  </div>
</section>
