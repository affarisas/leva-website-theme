<!-- < Key generate > -->
<?php $component_key = uniqid(); ?>
<!-- < Styling > -->
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/homepage/hero-3d/style.css">
<!-- < Component > -->
<section class="leva-component part-homepage-hero-3d" id="<?php echo $component_key; ?>">
	<div class="background">
		<canvas id="webgl-canvas" class="webgl"></canvas>
     <div class="left">
      <div class="progressive-blur">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
       </div>
     </div>
     
     <div class="financial-indicators-bar">
        <div class="bar-track">
            <div class="marquee-content">
                <?php for($i=0; $i<12; $i++): ?>
                    <div class="item">
                        <span class="icon">★</span>
                        <span>TASA DE INTERÉS BANREP: <strong><?php echo get_sub_field('tasa_de_interes_del_banco_de_la_republica'); ?>%</strong></span>
                    </div>
                    <div class="item">
                        <span class="icon">★</span>
                        <span>TRM ACTUAL: <strong><?php echo get_sub_field('trm'); ?>$</strong></span>
                    </div>
                <?php endfor; ?>
            </div>
        </div>
     </div>

     <!-- <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/homepage/hero-3d/background.jpg" alt="Crédito para tu negocio"> -->
	</div>
	<div class="lock__ui">
		<div class="left">
      <h1><?php echo get_sub_field('title'); ?></h1>
      <p> <?php echo get_sub_field('description'); ?> </p>
      <?php if( have_rows('cartas') ): ?>
        <div class="cards">
          <?php while( have_rows('cartas') ): the_row(); ?>
            <div class="card">
              <img src="<?php echo get_sub_field('icono'); ?>" alt="Crédito para tu negocio">
              <h5><?php echo get_sub_field('titulo'); ?></h5>
              <p><?php echo get_sub_field('descripcion'); ?></p>
            </div>
          <?php endwhile; ?>
        </div>
      <?php endif; ?>
      <a href="<?php echo get_sub_field('url_cta'); ?>" class="fill primary">
        <span><?php echo get_sub_field('titulo_cta'); ?></span>
      </a>
		</div>
		<div class="right">
    </div>
	</div>
</section>
<!-- < Script > -->
<!-- <script src="<?php bloginfo('template_url'); ?>/js/3d/performance-monitor.js"></script> -->
<script src="<?php bloginfo('template_url'); ?>/js/3d/loader-delay.js?key=<?php echo $component_key; ?>&model3d=homepage&templateUrl=<?php bloginfo('template_url');?>&componentName=homepage/hero-3d"></script>

<!-- El script de la logica threeJS ahora será cargado dinámicamente por el loader-delay.js  -->
<!-- <script type="module" src="<?php bloginfo('template_url'); ?>/parts/homepage/hero/script.js?key=<?php echo $component_key; ?>&templateUrl=<?php bloginfo('template_url');?>"></script> -->