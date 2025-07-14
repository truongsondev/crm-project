import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
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
import { CommonModule } from '@angular/common';
import { UserService } from '@app/services/user.service';
import { User } from '@app/interfaces/user.interface';
import { HeaderColumn } from '@app/custom-types/shared.type';
import { ModalDiaLogComponent } from '@app/shares/modal/modal.component';
import { UserForm } from '@app/form/user/user.form';

@Component({
  standalone: true,
  selector: 'user-management',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [
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

  displayedColumns: string[] = [
    'employee',
    'username',
    'email',
    'salutation',
    'role',
    'jobTitle',
    'manager',
    'action',
  ];
  columnDefs: HeaderColumn[] = [
    { column: 'employee', label: 'Employee' },
    { column: 'username', label: 'Username' },
    { column: 'email', label: 'Email' },
    { column: 'salutation', label: 'Salutation' },
    { column: 'role', label: 'Role' },
    { column: 'jobTitle', label: 'Job Title' },
    { column: 'manager', label: 'Manager' },
    { column: 'action', label: 'Action' },
  ];
  dataSource!: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  onSearch(event: string) {
    if (event !== '') {
      this.userService.getListUser({ username: event }).subscribe((data) => {
        console.log('data:::', data);
        this.employees = data;
        this.dataSource.data = data;
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
        title: "Add user"
      },
    });
  }

  
}
