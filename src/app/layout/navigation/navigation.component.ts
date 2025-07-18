import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
@Component({
  standalone: true,
  selector: 'nav-component',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
})
export class NavComponent {
  selectedItem = 'dashboard';

  selectMenu(item: string) {
    this.selectedItem = item;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const segments = event.urlAfterRedirects.split('/');
        const last = segments.pop() || '';
        this.selectedItem = last;
      }
    });
  }
}
