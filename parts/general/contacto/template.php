<!-- < Key generate > -->
<?php $component_key = uniqid(); ?>
<!-- < Styling > -->
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/general/contacto/style.css">
<?php
    $titulo = get_sub_field('titulo') ?: 'Contáctanos';
    $descripcion = get_sub_field('descripcion') ?: 'Déjanos tus datos y nos pondremos en contacto contigo.';
?>
<!-- < Component > -->
<section class="leva-component part-general-contacto" id="<?php echo $component_key; ?>">
    
    <div class="content-wrapper">
        <div class="header-container">
            <h2><?php echo esc_html($titulo); ?></h2>
            <p class="description"><?php echo esc_html($descripcion); ?></p>
        </div>

        <div class="container contact-card">
            <div class="form-row full-width">
                <div class="form-group">
                    <label>Correo electrónico</label>
                    <div class="input-wrapper">
                        <input type="email" placeholder="alguien@ejemplo.com" id="email-input">
                    </div>
                </div>
            </div>

            <div class="form-row full-width">
                <div class="form-group">
                    <label>Celular</label>
                    <div class="input-wrapper">
                        <input type="tel" placeholder="+57 321 456 7890" id="telefono-input">
                    </div>
                </div>
            </div>

            <div class="form-row full-width">
                <div class="form-group">
                    <label>Cédula</label>
                    <div class="input-wrapper">
                        <input type="text" placeholder="Tu número de identificación" id="cedula-input">
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group checkbox-group">
                    <input type="radio" id="cc-<?php echo $component_key; ?>" name="tipo-documento-<?php echo $component_key; ?>" value="C.C." checked>
                    <label for="cc-<?php echo $component_key; ?>">C.C.</label>
                </div>
                <div class="form-group checkbox-group">
                    <input type="radio" id="te-<?php echo $component_key; ?>" name="tipo-documento-<?php echo $component_key; ?>" value="Tarjeta de extranjero">
                    <label for="te-<?php echo $component_key; ?>">Tarjeta de extranjero</label>
                </div>
            </div>

            <div class="form-actions">
                <button class="fill primary full-width" id="submit-contact-btn">
                    Enviar solicitud
                </button>
            </div>
            
            <div class="success-message" style="display: none;">
                <div class="icon">✓</div>
                <h3>¡Mensaje enviado!</h3>
                <p>Pronto nos pondremos en contacto contigo.</p>
                <button class="outline primary full-width" id="reset-form-btn">Enviar otro mensaje</button>
            </div>
        </div>
    </div>

</section>
<!-- < Script > -->
<script src="<?php bloginfo('template_url'); ?>/parts/general/contacto/script.js?key=<?php echo $component_key; ?>"></script>