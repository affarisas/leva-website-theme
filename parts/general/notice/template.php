<section class="general-notice <?php echo get_sub_field('tipo'); ?>">
  <div class="lock__ui">
    <?php if(get_sub_field('tipo') == 'info') { echo '<img src="' . get_template_directory_uri() . '/assets/img/parts/general/notice/info-bold.svg" alt="Info" />'; } ?>
    <p>
      <span class="bold">
        <?php
          if(get_sub_field('tipo') == 'info') { echo 'Nota: '; }
        ?>
      </span>
      <?php echo get_sub_field('mensaje'); ?>
    </p>
  </div>
</section>