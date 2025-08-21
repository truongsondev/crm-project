import { Component } from '@angular/core';
import { NavComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  selector: 'layout-component',
  imports: [HeaderComponent, NavComponent, RouterOutlet],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
