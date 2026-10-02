import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '@core/services/Auth/auth';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideUser, LucideShoppingCart, LucideLogOut } from '@lucide/angular';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css', '../../../../styles/bootstrap.min.css', '../../../../styles/style.css'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule,
    MatButtonModule, LucideUser, LucideShoppingCart, LucideLogOut,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
  ],
})
export class AppNavComponent {

  readonly LucideUser = LucideUser;
  readonly LucideShoppingCart = LucideShoppingCart;
  readonly LucideLogOut = LucideLogOut;


  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = this.authService.isLoggedIn();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
