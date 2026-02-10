<?php 
/**
 * Template Name: main
* 
* Home page Layout
*/
get_header();

if(has_flexible('components')):
  the_flexible('components');
endif;

?>


<!-- HOMEPAGE SCREEN -->
<?php if(is_front_page()){ 
  // -------------------- homepage --------------------
  
?>
<?php
} ?>

<!-- SERVICIOS SCREEN -->
<?php 
  if(is_post_type_archive("servicios")){
  ?>
    
  <?php
  }
?>

<!-- BLOG SCREEN -->
<?php if(is_home()) {
  // ------------------- blog ---------------------------
}
?>

<?php 
get_footer(); 
?> 