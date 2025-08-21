import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ACCESS_PAGE_ENUM } from '@app/enums/shared.enum';
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
  isLogined = false;
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

  checkUser() {
    const user = this.commonService.parseToJson();
    if (user !== '') {
      this.isLogined = true;
    } else {
      this.isLogined = false;
    }
  }

  private rolePermissions: Record<string, string[]> = {
    USER_ADMIN: [
      ACCESS_PAGE_ENUM.DASHBOARD,
      ACCESS_PAGE_ENUM.CONTACT,
      ACCESS_PAGE_ENUM.SALE_ORDER,
      ACCESS_PAGE_ENUM.USER_MANAGEMENT,
    ],
    DIR: [ACCESS_PAGE_ENUM.DASHBOARD],
    SALES_MGR: [ACCESS_PAGE_ENUM.DASHBOARD, ACCESS_PAGE_ENUM.SALE_ORDER],
    SALES_EMP: [ACCESS_PAGE_ENUM.DASHBOARD, ACCESS_PAGE_ENUM.SALE_ORDER],
    CONTACT_MGR: [ACCESS_PAGE_ENUM.DASHBOARD, ACCESS_PAGE_ENUM.CONTACT],
    CONTACT_EMP: [ACCESS_PAGE_ENUM.DASHBOARD, ACCESS_PAGE_ENUM.CONTACT],
    USER_READ_ONLY: [ACCESS_PAGE_ENUM.DASHBOARD],
  };

  hasAccess(page: string): boolean {
    const allowed = this.rolePermissions[this.roleOfUser] || [];
    return allowed.includes(page);
  }

  ngOnInit() {
    this.checkUser();
    if (this.isLogined) {
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
    } else {
      this.router.navigate(['/auth/sign-in']);
    }
  }
  logout() {
    localStorage.clear();

    this.router.navigate(['/auth/sign-in']);
  }
}
