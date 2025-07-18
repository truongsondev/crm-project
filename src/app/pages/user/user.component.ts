import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SearchComponent } from '@app/shares/search/search.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, JsonPipe } from '@angular/common';
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
@Component({
  standalone: true,
  selector: 'user-management',
  templateUrl: './user.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDatepickerModule,
    MatCheckboxModule,
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
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  displayedColumns: string[] = [
    'all',
    'employee',
    'user_name',
    'email',
    'salutation',
    'role',
    'job_title',
    'manager_name',
    'action',
  ];
  columnDefs: HeaderColumn[] = [
    { column: 'all', label: 'All' },
    { column: 'employee', label: 'Employee' },
    { column: 'user_name', label: 'Username' },
    { column: 'email', label: 'Email' },
    { column: 'salutation', label: 'Salutation' },
    { column: 'role', label: 'Role' },
    { column: 'job_title', label: 'Job Title' },
    { column: 'manager_name', label: 'Manager' },
    { column: 'action', label: 'Action' },
  ];

  displayRole = {
    USER_ADMIN: 'Admin',
    DIR: 'Director',
    SALES_MGR: 'Sales Manager',
    SALES_EMP: 'Sales Person',
    CONTACT_MGR: 'Contact Manager',
    CONTACT_EMP: 'Contact Employee',
    USER_READ_ONLY: 'Guest',
  };

  dataSource!: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  onSearch(event: string) {
    if (event !== '') {
      this.userService.getListUser('').subscribe((data) => {
        this.employees = data.filter(
          (u) => u.user_name.includes(event) || u.email.includes(event),
        );
        this.dataSource.data = this.employees;
      });
    } else {
      this.userService.getListUser('').subscribe((data) => {
        this.employees = data;
        this.dataSource.data = data;
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
    this.userService.getListUser('').subscribe((data) => {
      this.employees = data;
      this.dataSource.data = data;
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
          selectedUser: row,
          userList: this.employees,
        },
      },
    });
  }

  getDisplayRole(role: string): string {
    const rolekey = role as keyof typeof this.displayRole;
    return this.displayRole[rolekey] || '-';
  }

  getUserByRole(role: Event) {
    const value = (role.target as HTMLSelectElement).value;
    console.log(value);
    this.userService.getListUser({ role: value }).subscribe((res) => {
      this.employees = res;
      this.dataSource.data = res;
    });
  }

  getUserByTime() {
    const start = this.range.get('start')?.value;
    const end = this.range.get('end')?.value;
    if (!start || !end) return;

    this.userService.getListUser('').subscribe((res) => {
      const result = res.filter((emp) => {
        const createdTime = new Date(emp.created_time);
        return createdTime >= start && createdTime <= end;
      });
      this.employees = result;
      this.dataSource.data = result;
    });
  }
}
