<?php $component_key = uniqid(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/general/features-section/style.css">
<section class="leva-component part-general-features-section" id="<?php echo $component_key; ?>">
    <div class="lock__ui">
        <div class="header-container">
            <h2>¿Qué se necesita?</h2>
        </div>

        <div class="features-grid">
            <?php echo the_flexible('feature-card'); ?>
        </div>
    </div>
</section>
