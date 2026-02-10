<?php $component_key = uniqid(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/general/timeline-steps/style.css">
<section class="leva-component part-general-timeline-steps" id="<?php echo $component_key; ?>">
    <div class="lock__ui">
        <div class="header-container">
            <h2><?php the_sub_field('titulo'); ?></h2>
            <p class="description"><?php the_sub_field('descripcion'); ?></p>
        </div>
        
        <div class="timeline-container">
            <div class="line-container">
                <div class="timeline-line-gray"></div>
                <div class="timeline-line-blue"></div>
            </div>
            
            <div class="steps-wrapper">
              <?php if( have_rows('etapas') ): ?>
                <?php while( have_rows('etapas') ): the_row();
                  $icono = get_sub_field('icono');
                  $titulo = get_sub_field('titulo');
                  $descripcion = get_sub_field('descripcion');
                  $link_formulario = get_sub_field('link_formulario');
                ?>
                  <div class="step" data-step="<?php echo get_row_index(); ?>">
                    <div class="circle-container">
                      <div class="circle <?php echo get_row_index() == 1 ? 'active' : ''; ?>"><?php echo get_row_index(); ?></div>
                    </div>
                    <div class="content">
                      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 15px;">
                        <img src="<?php echo $icono; ?>" alt="<?php the_sub_field('icono_alt'); ?>" class="step-icon">
                        <h4><?php echo $titulo; ?></h4>
                      </div>
                      <p><?php echo $descripcion; ?></p>
                      <?php if( $link_formulario ): ?>
                        <a href="<?php echo $link_formulario; ?>" class="main-gradient">Ir al formulario ></a>
                      <?php endif; ?>
                    </div>
                  </div>
                <?php endwhile; ?>
              <?php endif; ?>
            </div>
            <!-- if php get sub field text is not empty then show the button -->
             <?php if( get_sub_field('titulo_cta') ): ?>
              <a href="<?php echo get_sub_field('url_cta'); ?>" class="fill primary" style="display: block; margin-top: 30px; width: fit-content; margin-left: auto; margin-right: auto;">
                <span><?php echo get_sub_field('titulo_cta'); ?></span>
              </a>
            <?php endif; ?>
        </div>
    </div>
</section>
<script src="<?php bloginfo('template_url'); ?>/parts/general/timeline-steps/script.js"></script>
