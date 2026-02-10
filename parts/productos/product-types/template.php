<?php $component_key = uniqid(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/productos/product-types/style.css">
<section class="leva-component part-productos-product-types" id="<?php echo $component_key; ?>">
    <div class="lock__ui">
        <!-- Optional Header if needed based on previous context, but image starts with cards mostly. Keeping header from previous read if user wants it, but image doesn't show it explicitly at top, wait, previous read had a header. The user said "tal cual como la imágen adjunta". The image shows 3 cards. The previous file had "Nuestros productos". I will keep the header but focus on the cards matching the image. -->
        <div class="header-container">
            <h2>Nuestros productos</h2>
            <p class="description">Ofrecemos diferentes tipos de créditos adaptados a tus necesidades específicas.</p>
        </div>

        <div class="cards-container">
          <?php echo the_flexible('card-product'); ?>
            <!-- Card 1: Crédito Personal -->
            <!-- <div class="product-card">
                <div class="icon-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>Crédito personal</h3>
                
                <div class="details">
                    <div class="detail-item">
                        <span class="label">Monto del crédito</span>
                        <span class="value">$500.000 - 5.000.000 COP</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Plazo:</span>
                        <span class="value">3 - 12 meses</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Tasa de interés</span>
                        <span class="value">1.5% mensual</span>
                    </div>
                </div>

                <div class="benefits">
                    <span class="label">Beneficios:</span>
                    <ul>
                        <li>Aprobación en 24 horas</li>
                        <li>Flexibilidad de pago</li>
                        <li>Sin requisitos complejos</li>
                        <li>Para cualquier propósito</li>
                    </ul>
                </div>

                <button class="outline primary full-width">Simula tu crédito</button>
            </div> -->

            <!-- Card 2: Crédito Microempresarial -->
            <!-- <div class="product-card">
                <div class="icon-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 21H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5 21V7L13 3V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19 21V11L13 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 9V9.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 12V12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 15V15.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 18V18.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>Crédito Microempresarial</h3>
                
                <div class="details">
                    <div class="detail-item">
                        <span class="label">Monto del crédito</span>
                        <span class="value">$1.000.000 - 20.000.000 COP</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Plazo:</span>
                        <span class="value">6 - 24 meses</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Tasa de interés</span>
                        <span class="value">1.5% mensual</span>
                    </div>
                </div>

                <div class="benefits">
                    <span class="label">Beneficios:</span>
                    <ul>
                        <li>Impulsa tu negocio</li>
                        <li>Tasas preferenciales</li>
                        <li>Asesoría empresarial</li>
                        <li>Plazos extendidos</li>
                    </ul>
                </div>

                <button class="outline primary full-width">Simula tu crédito</button>
            </div> -->

            <!-- Card 3: Crédito Educativo -->
            <!-- <div class="product-card">
                <div class="icon-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 10V15C22 15 18 17 12 17C6 17 2 15 2 15V10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 16V19C6 19 8 20 10 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>Crédito Educativo</h3>
                
                <div class="details">
                    <div class="detail-item">
                        <span class="label">Monto del crédito</span>
                        <span class="value">$500.000 - 3.000.000 COP</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Plazo:</span>
                        <span class="value">3 - 12 meses</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Tasa de interés</span>
                        <span class="value">1.0% mensual</span>
                    </div>
                </div>

                <div class="benefits">
                    <span class="label">Beneficios:</span>
                    <ul>
                        <li>Invierte en tu futuro</li>
                        <li>Tasa preferencial</li>
                        <li>Proceso simplificado</li>
                        <li>Sin codeudor</li>
                    </ul>
                </div>

                <button class="outline primary full-width">Simula tu crédito</button>
            </div> -->
        </div>
    </div>
</section>
