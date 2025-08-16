import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonService } from '@app/services/common.service';
@Component({
  standalone: true,
  selector: 'nav-component',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
})
export class NavComponent {
  selectedItem = 'dashboard';
  username = '';

  isExpanded = true;

  selectMenu(menu: string) {
    this.selectedItem = menu;
  }
  roleOfUser: string = '';
  constructor(
    private router: Router,
    private commonService: CommonService,
  ) {}
  getUserName() {
    const user = this.commonService.parseToJson();
    return user.first_name + ' ' + user.last_name;
  }

  getRoleUser(): string {
    const user = this.commonService.parseToJson();
    return user.role;
  }

  ngOnInit() {
    this.username = this.getUserName();
    this.roleOfUser = this.getRoleUser();
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
}
