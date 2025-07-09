import { Component } from '@angular/core';
import { HeaderComponent } from '@layout/header/header.component';
import { NavComponent } from '@layout/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  selector: 'layout-component',
  imports: [HeaderComponent, NavComponent, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
