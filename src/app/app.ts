import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AppNavComponent } from './features/layout/app-nav/app-nav.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,AppNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //Es super importante en los imports poner RouterLink si vamos a viajar entre componentes
  protected readonly title = signal('Angular-FerreViky');
}
