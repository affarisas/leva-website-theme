<?php $component_key = uniqid(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/homepage/steps-timeline/style.css">
<section class="leva-component part-homepage-steps-timeline" id="<?php echo $component_key; ?>">
    <div class="lock__ui">
        <div class="header-container">
            <h2>Consigue tu préstamo en <br> <span class="highlight">3 simples pasos</span></h2>
            <p class="description">Nuestro proceso está diseñado para ser rápido, transparente y sin papeleos.</p>
        </div>
        
        <div class="timeline-container">
            <div class="line-container">
                <div class="timeline-line-gray"></div>
                <div class="timeline-line-blue"></div>
            </div>
            
            <div class="steps-wrapper">
                <div class="step" data-step="1">
                    <div class="circle-container">
                        <div class="circle active">1</div>
                    </div>
                    <div class="content">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 15px;">
                            <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/homepage/steps-timeline/calculator-bold.svg" alt="Simula y solicita" class="step-icon">
                            <h4>Simula y solicita</h4>
                        </div>
                        <p>Usa nuestra calculadora, elige tu monto y completa el formulario en menos de 5 minutos.</p>
                    </div>
                </div>
                <div class="step" data-step="2">
                    <div class="circle-container">
                        <div class="circle">2</div>
                    </div>
                    <div class="content">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 15px;">
                            <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/homepage/steps-timeline/phone-bold.svg" alt="Recibe la aprobación" class="step-icon">
                            <h4>Recibe la aprobación</h4>
                        </div>
                        <p>Analizamos tu solicitud en tiempo récord y te damos una oferta clara y sin compromisos por teléfono o correo electrónico.</p>
                    </div>
                </div>
                <div class="step" data-step="3">
                    <div class="circle-container">
                        <div class="circle">3</div>
                    </div>
                    <div class="content">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 15px;">
                            <img src="<?php bloginfo('template_url'); ?>/assets/img/parts/homepage/steps-timeline/hand-coins-bold.svg" alt="Disfruta de tu dinero" class="step-icon">
                            <h4>Disfruta de tu dinero</h4>
                        </div>
                        <p>Acepta la oferta y recibe el dinero directamente en tu cuenta bancaria en horas.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <button class="fill primary">Simula tu crédito</button>
    </div>
</section>
<script src="<?php bloginfo('template_url'); ?>/parts/homepage/steps-timeline/script.js"></script>
