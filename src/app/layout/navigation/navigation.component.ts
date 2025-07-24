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
  username = '';
  roleOfUser: string = this.getRoleUser();
  constructor(private router: Router) {}
  getUserName() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return '';
    const user = JSON.parse(userJson);
    return user.first_name + ' ' + user.last_name;
  }

  getRoleUser(): string {
    const userJson = localStorage.getItem('user');

    if (!userJson) return '';
    const user = JSON.parse(userJson);
    return user.role;
  }

  ngOnInit() {
    this.username = this.getUserName();
    const segments = this.router.url.split('/');
    const last = segments.pop() || '';
    this.selectedItem = last;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const segments = event.urlAfterRedirects.split('/');
        const last = segments.pop() || '';
        this.selectedItem = last;
      }
    });
  }
  selectMenu(item: string) {
    this.selectedItem = item;
  }
}
