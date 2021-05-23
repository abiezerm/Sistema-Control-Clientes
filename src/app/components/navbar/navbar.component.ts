import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit() {
    $(document).ready(function () {
      var $window = $(window);

      function checkWindowWidth() {
        var windowsize = $window.width();
        if (windowsize > 1000) {
          $('#navbar').css('display', 'block');
        } else {
          $('#navbar').css('display', 'none');
        }
      }
      //Verifico el Ancho de la Pantalla
      checkWindowWidth();

      $(window).resize(checkWindowWidth);
    });

    $('#navbar-btn').click(function () {
      $('#navbar').toggle();
    });
  }

  onLogOut() {
    this.authService.onLogout();
  }
}
