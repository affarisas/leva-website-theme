<?php $component_key = uniqid(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/requisitos/intro-section/style.css">
<section class="leva-component part-requisitos-intro-section" id="<?php echo $component_key; ?>">
  <div class="lock__ui">
    <div class="header-container">
      <h2><?php echo get_sub_field('title'); ?></h2>
      <p class="description"><?php echo get_sub_field('description'); ?></p>
    </div>
  </div>
</section>
