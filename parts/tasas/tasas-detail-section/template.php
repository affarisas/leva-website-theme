<?php $component_key = uniqid(); ?>
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/tasas/tasas-detail-section/style.css">
<section class="leva-component part-tasas-detail-section" id="<?php echo $component_key; ?>">
    <div class="lock__ui">
        <div class="header-container">
            <h2><?php echo get_sub_field('title'); ?></h2>
            <p class="description"><?php echo get_sub_field('description'); ?></p>
        </div>

        <?php if( have_rows('tabla-tipo-credito') ): ?>
          <div class="table-component">
            <table class="creditos-table">
                <thead>
                    <tr>
                        <th>Tipo de crédito</th>
                        <th>Monto</th>
                        <th>Plazo</th>
                        <th>Tasa mensual</th>
                        <th>Tasa E.A.</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while( have_rows('tabla-tipo-credito') ): the_row(); 
                        $tipo = get_sub_field('tipo');
                        $monto = get_sub_field('monto');
                        $plazo = get_sub_field('plazo');
                        $tasa_mensual = get_sub_field('tasa-mensual');
                        $tasa_ea = get_sub_field('tasa-ea');
                    ?>
                        <tr>
                            <td><?php echo $tipo; ?></td>
                            <td><?php echo $monto; ?></td>
                            <td><?php echo $plazo; ?></td>
                            <td><?php echo $tasa_mensual; ?></td>
                            <td><?php echo $tasa_ea; ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
          </div>
      <?php endif; ?>
    </div>
</section>
<script src="<?php bloginfo('template_url'); ?>/parts/tasas/tasas-detail-section/script.js"></script>