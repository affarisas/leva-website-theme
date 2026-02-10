<!-- < Key generate > -->
<?php $component_key = uniqid(); ?>
<!-- < Styling > -->
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/general/credit-simulator/style.css">
<?php
    $titulo = get_sub_field('titulo');
    $descripcion = get_sub_field('descripcion');
    
    // Obtener los grupos de parámetros
    $lv_parametros = get_sub_field('lv_parametros');
    $laf_parametros = get_sub_field('laf_parametros');

    // Construir el objeto de configuración
    $configData = array(
        'LV' => array(
            'name' => $lv_parametros['nombre'],
            'tasaEA' => floatval($lv_parametros['tasaea']),
            'tasaPeriodica' => floatval($lv_parametros['tasaperiodica']),
            'leyMipyme' => floatval($lv_parametros['leymipyme']),
            'leyMipymeDescuento' => floatval($lv_parametros['leymipymedescuento']),
            'salarioMinimo' => floatval($lv_parametros['salariominimo']),
            'seguro' => floatval($lv_parametros['seguro']),
            'visible' => strcmp(get_sub_field('lv_visible'), 'habilitado') === 0
        ),
        'LAF' => array(
            'name' => $laf_parametros['nombre'],
            'tasaEA' => floatval($laf_parametros['tasaea']),
            'tasaPeriodica' => floatval($laf_parametros['tasaperiodica']),
            'leyMipyme' => floatval($laf_parametros['leymipyme']),
            'leyMipymeDescuento' => floatval($laf_parametros['leymipymedescuento']),
            'salarioMinimo' => floatval($laf_parametros['salariominimo']),
            'seguro' => floatval($laf_parametros['seguro']),
            'visible' => strcmp(get_sub_field('laf_visible'), 'habilitado') === 0
        )
    );
?>
<!-- < Component > -->
<section class="leva-component part-general-credit-simulator" id="<?php echo $component_key; ?>">
    
    <!-- STEP 1: Formulario inicial -->
    <div class="lock__ui" data-step="1" style="flex-direction: column;">
        <div class="header-container">
            <h2><?php echo esc_html($titulo); ?></h2>
            <p class="description"><?php echo esc_html($descripcion); ?></p>
        </div>

        <div class="container simulator-card">
            <div class="form-row">
                <div class="form-group">
                    <label>¿Cuánto dinero necesitas?</label>
                    <div class="input-wrapper">
                        <input type="text" value="$2.000.000" class="money-input" id="monto-input">
                        <span class="currency">COP</span>
                    </div>
                </div>
                <div class="form-group">
                    <label>¿Cuántas cuotas?</label>
                    <div class="input-wrapper">
                        <select id="cuotas-select">
                            <!-- repeat 1-36 months (each one) -->
                            <?php for($i = 1; $i <= 36; $i++) { ?>
                                <option value="<?php echo $i; ?>"><?php echo $i . ( $i == 1 ? ' mes' : ' meses' ); ?></option>
                            <?php } ?>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="form-row full-width">
                <div class="form-group">
                    <label>Déjanos tu celular para contactarte</label>
                    <div class="input-wrapper">
                        <input type="tel" placeholder="+57 321 456 7890" id="telefono-input">
                    </div>
                </div>
            </div>

            <div class="form-row full-width">
                <div class="form-group checkbox-group" style="justify-content: center;">
                    <input type="checkbox" id="terms-check">
                    <label for="terms-check">
                        Acepto el <a href="/politica-de-privacidad" target="_blank" style="color: var(--main-color); text-decoration: underline;">tratamiento de datos personales</a>
                    </label>
                </div>
            </div>

            <button class="fill primary full-width" id="calculate-btn">Calcular</button>
        </div>
    </div>

    <!-- STEP 2: Loading -->
    <div class="lock__ui" data-step="2" style="display: none;">
        <div class="loading-container">
            <div class="spinner"></div>
            <h3>Calculando las mejores tasas para ti</h3>
            <p>Estamos procesando tu información...</p>
        </div>
    </div>

    <!-- STEP 3: Resultados -->
    <div class="lock__ui" data-step="3" style="display: none;">
        <div class="header-container">
            <h2><?php echo esc_html($titulo); ?></h2>
            <p class="description"><?php echo esc_html($descripcion); ?></p>
        </div>

        <div class="container results-container" id="results-container">
            <!-- Contenido generado dinámicamente por JS -->
        </div>
    </div>

    <!-- STEP 4: Modal de Planes de Pago -->
    <div class="payment-plan-modal" id="payment-plan-modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Planes de pago</h3>
                <button class="close-modal" id="close-modal-btn">✕</button>
            </div>
            
            <div class="modal-body">
                <div class="parameters-section">
                    <h3>Parámetros del plan de pago</h3>
                    <div class="parameters-grid" id="modal-params">
                        <!-- Contenido generado dinámicamente -->
                    </div>
                </div>

                <div class="projection-section">
                    <h3>Detalles de la proyección</h3>
                    <div class="table-wrapper">
                        <table class="projection-table" id="modal-table">
                            <thead>
                                <tr>
                                    <th>Cuota</th>
                                    <th>Saldo anterior</th>
                                    <th>Interés</th>
                                    <th>MiPyME</th>
                                    <th>Seguro</th>
                                    <th>Capital</th>
                                    <th>Valor cuota</th>
                                    <th>Saldo capital</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Contenido generado dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <?php if ( is_user_logged_in() && current_user_can('administrator') ) : ?>
                    <button class="outline primary" id="download-pdf-btn">
                        <span>⬇</span> Descargar proyección
                    </button>
                <?php endif; ?>
                <button class="fill primary" id="request-from-modal-btn">
                    Solicitar crédito
                </button>
            </div>
        </div>
    </div>

    <!-- STEP 5: Solicitud Final -->
    <div class="lock__ui" data-step="5" style="display: none;">
        <div class="container simulator-card request-card">
            <div class="header-container">
                <div style="display: flex;">
                    <img src="<?php bloginfo('template_url');?>/assets/img/parts/general/credit-simulator/phone.svg" alt="">
                    <h5 style="margin-left: 8px;"> Te contactaremos</h5>
                </div>
                <p class="description">Proveernos más información sobre ti nos ayudará a agilizar tu aprobación.</p>
            </div>

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
                    <label>Cédula</label>
                    <div class="input-wrapper">
                        <input type="text" placeholder="Tu número de identificación" id="cedula-input">
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group checkbox-group">
                    <input type="radio" id="cc" name="tarjeta-extranjero" value="C.C." checked>
                    <label for="cc">C.C.</label>
                </div>
                <div class="form-group checkbox-group">
                    <input type="radio" id="te" name="tarjeta-extranjero" value="Tarjeta de extranjero">
                    <label for="te">Tarjeta de extranjero</label>
                </div>
            </div>

            <div class="form-actions">
                <button class="fill primary full-width" id="submit-request-btn">
                    Solicitar crédito
                </button>
            </div>
        </div>
    </div>

</section>
<!-- < Script > -->
<script src="<?php bloginfo('template_url'); ?>/parts/general/credit-simulator/script.js?key=<?php echo $component_key; ?>&templateUrl=<?php echo urlencode(get_bloginfo('template_url')); ?>&configData=<?php echo urlencode(json_encode($configData)); ?>"></script>