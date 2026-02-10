    

    <div class="footer-content">
      <div class="lock__ui subcontainer-footer-content">
        <div class="container-cols-footer-container">
          <div class="col-footer-container">
            <img class="lazy logo-footer-container" data-src="<?php bloginfo('template_url'); ?>/assets/img/leva-logo.svg" alt="logo titulo leva"/>
            <div class="title-footer-container">Atención</div>
            <div class="row-footer-container">Carrera 26 N°17-40, Oficina 420, Edificio Pasaje Liceo (Pasto)</div>
            <div class="row-footer-container">Lunes a viernes, 08:00 a.m. - 12:00 p.m. y 2 p.m. - 6:00 p.m., sábados de 09:00 a.m. - 01:00 p.m.</div>
          </div>
          <div class="col-footer-container">
            <div class="title-footer-container">Navegación</div>
            <?php
              wp_nav_menu(array(
                'menu' => "menu_footer",
                // Añadir un elemento personalizado (fijo) al final del menú
                'items_wrap' => '<ul id="%1$s" class="%2$s">%3$s<li class="custom-item"><a href="/blog">Blog</a></li></ul>',
              ));
            ?>

          </div>
          <div class="col-footer-container">
            <div class="title-footer-container">Legal</div>
            <ul class="list-footer-container">
              <li>
                <a href="<?php echo get_home_url(); ?>/terminos-y-condiciones-de-uso">Aviso Legal</a>
              </li>
              <li>
                <a href="<?php echo get_home_url(); ?>/politica-de-privacidad">Política de Privacidad</a>
              </li>
              <li>
                <a href="<?php echo get_home_url(); ?>/politica-de-cookies">Cookies</a>
              </li>
            </ul>
          </div>
          <div class="col-footer-container">
            <div class="title-footer-container">Contáctanos</div>
            <ul class="list-footer-container">
              <li> <a href="tel:+573224456319">+57 322 445 6319</a></li>
              <li> <a href="mailto:affarisas@gmail.com">affarisas@gmail.com</a></li>
            </ul>
            <div class="container-imgs-social-dentwork" style="gap: 20px;">
              <a target="_blank" href="https://www.facebook.com/share/17onLsp7ia/?mibextid=wwXIfr" title="Leva en Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="17" viewBox="0 0 9 17" fill="none">
                  <path d="M5.49392 16.5255V9.25074H7.99857L8.37087 6.40244H5.49392V4.5882C5.49392 3.76629 5.72763 3.20355 6.93149 3.20355H8.45693V0.664144C7.71472 0.586205 6.96867 0.548573 6.22222 0.55142C4.00834 0.55142 2.48834 1.87571 2.48834 4.30683V6.39712H0V9.24541H2.49378V16.5255H5.49392Z" fill="white"/>
                </svg>
              </a>
              <a target="_blank" href="https://www.instagram.com/levacolombia?igsh=MTQ2MTU3ZWlraWUzZQ==" title="Leva en Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M7.089 3.92263C5.08798 3.92263 3.47305 5.53759 3.47305 7.53865C3.47305 9.53971 5.08798 11.1547 7.089 11.1547C9.09003 11.1547 10.705 9.53971 10.705 7.53865C10.705 5.53759 9.09003 3.92263 7.089 3.92263ZM7.089 9.8888C5.79495 9.8888 4.7389 8.83273 4.7389 7.53865C4.7389 6.24457 5.79495 5.1885 7.089 5.1885C8.38306 5.1885 9.43911 6.24457 9.43911 7.53865C9.43911 8.83273 8.38306 9.8888 7.089 9.8888ZM10.853 2.9318C10.3858 2.9318 10.0086 3.30909 10.0086 3.7763C10.0086 4.24351 10.3858 4.6208 10.853 4.6208C11.3202 4.6208 11.6975 4.24527 11.6975 3.7763C11.6977 3.66536 11.6759 3.55548 11.6335 3.45296C11.5911 3.35044 11.5289 3.25728 11.4505 3.17884C11.3721 3.10039 11.2789 3.03819 11.1764 2.9958C11.0739 2.95341 10.964 2.93166 10.853 2.9318ZM14.1375 7.53865C14.1375 6.56545 14.1464 5.60106 14.0917 4.62962C14.0371 3.50126 13.7797 2.49985 12.9546 1.67474C12.1277 0.847872 11.1281 0.592229 9.99975 0.537575C9.02656 0.48292 8.06219 0.491735 7.09076 0.491735C6.11758 0.491735 5.15321 0.48292 4.18179 0.537575C3.05345 0.592229 2.05206 0.849635 1.22697 1.67474C0.400111 2.50161 0.144473 3.50126 0.0898199 4.62962C0.0351663 5.60282 0.0439814 6.56721 0.0439814 7.53865C0.0439814 8.51009 0.0351663 9.47624 0.0898199 10.4477C0.144473 11.576 0.401874 12.5774 1.22697 13.4026C2.05382 14.2294 3.05345 14.4851 4.18179 14.5397C5.15497 14.5944 6.11934 14.5856 7.09076 14.5856C8.06395 14.5856 9.02832 14.5944 9.99975 14.5397C11.1281 14.4851 12.1295 14.2277 12.9546 13.4026C13.7814 12.5757 14.0371 11.576 14.0917 10.4477C14.1481 9.47624 14.1375 8.51185 14.1375 7.53865ZM12.5861 11.6959C12.4574 12.0168 12.3022 12.2566 12.0537 12.5034C11.8051 12.752 11.5671 12.9071 11.2462 13.0358C10.3189 13.4043 8.11684 13.3215 7.089 13.3215C6.06116 13.3215 3.85739 13.4043 2.93004 13.0376C2.60917 12.9089 2.3694 12.7538 2.12258 12.5052C1.87399 12.2566 1.71885 12.0186 1.59015 11.6977C1.22344 10.7686 1.3063 8.56651 1.3063 7.53865C1.3063 6.51079 1.22344 4.30698 1.59015 3.37961C1.71885 3.05874 1.87399 2.81896 2.12258 2.57214C2.37117 2.32531 2.60917 2.1684 2.93004 2.03969C3.85739 1.67298 6.06116 1.75584 7.089 1.75584C8.11684 1.75584 10.3206 1.67298 11.248 2.03969C11.5688 2.1684 11.8086 2.32355 12.0554 2.57214C12.304 2.82073 12.4592 3.05874 12.5879 3.37961C12.9546 4.30698 12.8717 6.51079 12.8717 7.53865C12.8717 8.56651 12.9546 10.7686 12.5861 11.6959Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <hr class="line-footer-container">
        <div class="credits-container-footer-container">
          <div style="font-size: 14px; color: var(--neutral-400); text-align: center;">© Copyright 2026 Leva, AFFARI S.A.S. Todos los derechos reservados.</div>
        </div>
        <!-- <a class="web-creator-tag" href="https://leainnova.com">Web desarrollada por LeaInnova</a> -->
      </div>
    </div>
  </body>
</html>