import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SearchComponent } from '@app/shares/search/search.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { UserService } from '@app/services/user.service';
import { User } from '@app/interfaces/user.interface';
import { HeaderColumn } from '@app/custom-types/shared.type';
import { ModalDiaLogComponent } from '@app/shares/modal/modal.component';
import { UserForm } from '@app/form/user/user.form';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterComponent } from '@app/shares/filter.component.ts/filter.component';
import {
  COLUMNDEFS,
  DISPLAYCOLUMNROLE,
  DISPLAYROLES,
  ITEM_OF_PAGE,
} from '@app/constants/value.constant';
import { getManagerName as _getManagerName } from '@app/helper/getManagerName';
@Component({
  standalone: true,
  selector: 'user-management',
  templateUrl: './user.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    SearchComponent,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
  ],
})
export class UserManagementComponent implements AfterViewInit {
  employees: User[] = [];
  mySearch: string = 'user/email';
  length = 0;
  pageSize = ITEM_OF_PAGE;
  pageIndex = 0;
  Math = Math;
  getManagerName = _getManagerName;
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  displayedColumns: string[] = DISPLAYCOLUMNROLE;
  columnDefs: HeaderColumn[] = COLUMNDEFS;
  displayRole = DISPLAYROLES;

  dataSource!: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  onSearch(event: string) {
    if (event !== '') {
      this.userService.getListUser().subscribe((data) => {
        const { users } = data;

        this.employees = users.filter(
          (u) => u.username?.includes(event) || u.email.includes(event),
        );
        this.dataSource.data = this.employees;
      });
    } else {
      this.userService.getListUser().subscribe((data) => {
        const { users } = data;
        this.employees = users;
        this.dataSource.data = users;
      });
    }
  }
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource(this.employees);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.length = this.dataSource.data.length;
  }

  applyFilter(event: Event) {
    const { value } = event.target as HTMLInputElement;
    const filterValue = value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.userService.getListUser().subscribe((data) => {
      const { users }: { users: User[] } = data;
      this.employees = users;
      this.dataSource.data = users;
    });
  }

  openDialog() {
    this.dialog.open(ModalDiaLogComponent, {
      data: {
        component: UserForm,
        title: 'Add user',
        metadata: {
          action: 'create',
          user: null,
          userList: this.employees,
        },
      },
    });
  }
  onRowClick(row: User) {
    this.dialog.open(ModalDiaLogComponent, {
      data: {
        component: UserForm,
        title: 'Edit user',
        metadata: {
          action: 'update',
          dataSelected: row,
          dataList: this.employees,
        },
      },
    });
  }

  openFilter() {
    const dialogRef = this.dialog.open(ModalDiaLogComponent, {
      data: {
        component: FilterComponent,
        title: 'Filter by',
        metadata: {
          action: '#',
          user: null,
          userList: null,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employees = result.employees;
        this.dataSource.data = result.employees;
      }
    });
  }

  getDisplayRole(role: string): string {
    const rolekey = role as keyof typeof this.displayRole;
    return this.displayRole[rolekey] || '-';
  }
}
