<?php 
/**
 * Template Name: Politica de cookies
* 
* Home page Layout
*/
get_header();

// if(has_flexible('components')):
//   the_flexible('components');
// endif;
?>

<div class="single-post-detail" style="padding-top: 120px; display: flex; width: 100%">
  <div class="lock__ui" style="flex-direction: column; margin: auto;">
    <?php while (have_posts()) : the_post();
      $post_id = get_the_ID(); ?>
      <h1 class="entry-title light_theme" style="text-align: start; width: 100%"> <?php echo get_the_title($post_id); ?> </h1>
      <?php $post = get_post($post_id); setup_postdata($post); ?>
      <div class="entry-content" style="margin-top: 25px;">
          <div class="entry-description">
              <?php echo apply_filters('the_content', get_the_content(null, false, $post_id)); ?>
          </div>
      </div>
    <?php endwhile; ?>
  </div>
</div>

<?php 
get_footer(); 
?> 