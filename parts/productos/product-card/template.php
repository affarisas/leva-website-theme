<div class="product-card">
    <div class="icon-container">
        <?php $icono = get_sub_field('icono'); ?>
        <?php if( $icono ): ?>
          <img src="<?php echo wp_get_attachment_image_url($icono, 'thumbnail'); ?>" alt="">
        <?php endif; ?>
    </div>
    <h3> <?php echo get_sub_field('title'); ?> </h3>
    
    <div class="details">
        <div class="detail-item">
            <span class="label"><?php echo get_sub_field('monto'); ?></span>
            <span class="value"><?php echo get_sub_field('monto_valor'); ?> COP</span>
        </div>
        <div class="detail-item">
            <span class="label"><?php echo get_sub_field('plazo'); ?></span>
            <span class="value"><?php echo get_sub_field('plazo_valor'); ?></span>
        </div>
        <div class="detail-item">
            <span class="label"><?php echo get_sub_field('tasa'); ?></span>
            <span class="value"><?php echo get_sub_field('tasa_valor'); ?></span>
        </div>
    </div>

    <div class="benefits">
        <span class="label"><?php echo get_sub_field('beneficios'); ?></span>
        <?php if( have_rows('beneficios_lista') ): ?>
          <ul>
            <?php while( have_rows('beneficios_lista') ): the_row(); ?>
              <li><?php echo get_sub_field('beneficio'); ?></li>
            <?php endwhile; ?>
          </ul>
        <?php endif; ?>
    </div>

    <button class="outline primary full-width">Simula tu crédito</button>
</div>