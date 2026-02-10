<div class="feature-card">
  <div class="icon-wrapper">
    <?php $imagen = get_sub_field('icono'); ?>
    <?php if( $imagen ): ?>
      <img src="<?php echo $imagen['url']; ?>" alt="<?php echo $imagen['alt']; ?>">
    <?php endif; ?>
  </div>
  <h3><?php the_sub_field('titulo'); ?></h3>
  <p><?php the_sub_field('descripcion'); ?></p>
</div>