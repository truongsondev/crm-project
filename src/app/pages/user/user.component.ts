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
import { FetchListService } from '@app/services/fetchListService';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
export interface UserData {
  employee: string;
  username: string;
  email: string;
  role: string;
  jobTitle: string;
  manager: string;
  action: string;
}

@Component({
  selector: 'user-management',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [
    SearchComponent,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
  ],
  standalone: true,
})
export class UserManagementComponent implements AfterViewInit {
  employees: UserData[] = [];

  displayedColumns: string[] = [
    'employee',
    'username',
    'email',
    'salutation',
    'role',
    'jobTitle',
    'manager',
    // 'action',
  ];
  columnDefs = [
    { column: 'employee', label: 'Employee' },
    { column: 'username', label: 'Username' },
    { column: 'email', label: 'Email' },
    { column: 'salutation', label: 'Salutation' },
    { column: 'role', label: 'Role' },
    { column: 'jobTitle', label: 'Job Title' },
    { column: 'manager', label: 'Manager' },
    // { column: 'action', label: 'Action' },
  ];
  dataSource!: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  onSearch(event: string) {
    if (event !== '') {
      this.fetchListService
        .getList('employees', { username: event })
        .subscribe((data) => {
          console.log('data:::', data);
          this.employees = data;
          this.dataSource.data = data;
        });
    } else {
      this.fetchListService.getList('employees', '').subscribe((data) => {
        this.employees = data;
        this.dataSource.data = data;
      });
    }
  }
  constructor(private fetchListService: FetchListService) {
    this.dataSource = new MatTableDataSource(this.employees);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.fetchListService.getList('employees', '').subscribe((data) => {
      console.log('data:::', data);
      this.employees = data;
      this.dataSource.data = data;
    });
  }

  // openCalendarModal() {
  //   const dialogRef = this.dialog.open(CalendarModalComponent, {
  //     width: '400px',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       console.log('Khoảng ngày đã chọn:', result);
  //     }
  //   });
  // }
}
