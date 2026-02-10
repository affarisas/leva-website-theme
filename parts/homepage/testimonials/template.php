<?php 
$component_key = uniqid(); 

// Recopilar todos los testimonios del repeater
$testimonios_row1 = array();
$testimonios_row2 = array();

if( have_rows('testimonios') ):
    $all_testimonios = array();
    
    // Primero recopilamos todos los testimonios
    while( have_rows('testimonios') ): the_row();
        $all_testimonios[] = array(
            'cita' => get_sub_field('cita'),
            'nombre_cliente' => get_sub_field('nombre_cliente'),
            'avatar' => get_sub_field('avatar')
        );
    endwhile;
    
    // Dividir en dos grupos
    $total = count($all_testimonios);
    $mitad = ceil($total / 2);
    
    $testimonios_row1 = array_slice($all_testimonios, 0, $mitad);
    $testimonios_row2 = array_slice($all_testimonios, $mitad);
endif;

// Función para renderizar una card
function render_testimonial_card($testimonio) {
    $cita = $testimonio['cita'] ?? '';
    $nombre = $testimonio['nombre_cliente'] ?? 'Cliente';
    $avatar = $testimonio['avatar'] ?? '';
    ?>
    <div class="testimonial-card">
        <div class="quote-icon">"</div>
        <p class="text"><?php echo esc_html($cita); ?></p>
        <div class="author">
            <?php if ($avatar): ?>
                <img src="<?php echo esc_url($avatar['url']); ?>" alt="<?php echo esc_attr($nombre); ?>" class="avatar">
            <?php else: ?>
                <div class="avatar-placeholder"></div>
            <?php endif; ?>
            <span class="name"><?php echo esc_html($nombre); ?></span>
        </div>
    </div>
    <?php
}
?>

<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/homepage/testimonials/style.css">
<section class="leva-component part-homepage-testimonials" id="<?php echo $component_key; ?>">
    <div class="lock__ui">
        <div class="header-container">
            <h2><?php echo get_sub_field('titulo'); ?></h2>
            <p class="description"><?php echo get_sub_field('descripcion'); ?></p>
        </div>

        <?php if( !empty($testimonios_row1) && !empty($testimonios_row2) ): ?>
        <div class="marquee-container">
            <!-- Row 1: Scroll Left -->
            <div class="marquee-row scroll-left" style="--time: 80s">
                <div class="marquee-content">
                    <?php foreach($testimonios_row1 as $testimonio): ?>
                        <?php render_testimonial_card($testimonio); ?>
                    <?php endforeach; ?>
                </div>
                <!-- Duplicar exactamente una vez para el infinite loop -->
                <div class="marquee-content">
                    <?php foreach($testimonios_row1 as $testimonio): ?>
                        <?php render_testimonial_card($testimonio); ?>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Row 2: Scroll Right -->
            <div class="marquee-row scroll-right" style="--time: 80s">
                <div class="marquee-content">
                    <?php foreach($testimonios_row2 as $testimonio): ?>
                        <?php render_testimonial_card($testimonio); ?>
                    <?php endforeach; ?>
                </div>
                <!-- Duplicar exactamente una vez para el infinite loop -->
                <div class="marquee-content">
                    <?php foreach($testimonios_row2 as $testimonio): ?>
                        <?php render_testimonial_card($testimonio); ?>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php else: ?>
            <p style="text-align: center; padding: 60px 20px; color: #7D888A;">No hay testimonios disponibles.</p>
        <?php endif; ?>
    </div>
</section>