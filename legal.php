<?php 
/**
 * Template Name: Legal
* 
* Politica de Privacidad, Cookies, Aviso Legal Layout
*/
get_header();

// if(has_flexible('components')):
//   the_flexible('components');
// endif;
?>
<style>
  .legal-section .lock__ui {
    flex-direction: column;
    margin-bottom: 50px;
  }
  .legal-section .header-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    padding: 20px 0 60px;
    border-bottom: 1px solid var(--neutral-800);
  }
  .legal-section .header-container h2 {
    font-size: 35px;
    font-weight: 700;
    color: var(--neutral-black);
    text-align: center;
    width: 100%;
    max-width: 600px;
  }
  .legal-section p.legal-date {
    display: block;
    width: 100%;
    font-size: 13px;
    text-align: left;
    letter-spacing: 0.5px;
    margin-top: 20px;
  }
</style>
<div class="single-post-detail" style="padding-top: 120px; display: flex; width: 100%">
  <div class="lock__ui" style="flex-direction: column; margin: auto;">
    <?php while (have_posts()) : the_post();
      $post_id = get_the_ID(); ?>
      <section class="legal-section">
        <div class="lock__ui">
          <div class="header-container">
            <h2><?php echo get_the_title($post_id); ?></h2>
          </div>
          <p class="legal-date"><span class="bold">Ultima actualización:</span> <?php echo get_the_modified_date('d/m/Y'); ?></p>
          <?php $post = get_post($post_id); setup_postdata($post); ?>
          <div class="entry-content" style="margin-top: 25px;">
              <div class="entry-description">
                  <?php echo apply_filters('the_content', get_the_content(null, false, $post_id)); ?>
              </div>
          </div>
        </div>
      </section>
    <?php endwhile; ?>
  </div>
</div>

<?php 
get_footer(); 
?> 