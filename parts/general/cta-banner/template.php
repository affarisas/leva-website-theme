<?php 
$component_key = uniqid(); 

$titulo = get_sub_field('titulo');
$boton_1_texto = get_sub_field('boton_1_texto');
$boton_1_url = get_sub_field('boton_1_url');
$boton_2_texto = get_sub_field('boton_2_texto');
$boton_2_url = get_sub_field('boton_2_url');
?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/general/cta-banner/style.css">
<section class="leva-component part-general-cta-banner" id="<?php echo $component_key; ?>">
    <div class="lock__ui">
        <div class="banner-content">
            <div class="decorative-circle left">
                <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/general/cta-banner/leva-a-up.svg" alt="Decorative Circle">
            </div>
            
            <div class="content-wrapper">
                <?php if($titulo): ?>
                    <h3><?php echo esc_html($titulo); ?></h3>
                <?php endif; ?>
                
                <div class="actions">
                    <?php if($boton_1_texto && $boton_1_url): ?>
                        <a href="<?php echo esc_url($boton_1_url); ?>" class="fill white"><?php echo esc_html($boton_1_texto); ?></a>
                    <?php endif; ?>
                    
                    <?php if($boton_2_texto && $boton_2_url): ?>
                        <a href="<?php echo esc_url($boton_2_url); ?>" class="outline white"><?php echo esc_html($boton_2_texto); ?></a>
                    <?php endif; ?>
                </div>
            </div>

            <div class="decorative-circle right">
                <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/general/cta-banner/leva-a-down.svg" alt="Decorative Circle">
            </div>
        </div>
    </div>
</section>
