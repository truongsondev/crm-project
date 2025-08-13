import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SearchComponent } from '@app/shares/search/search.component';
import { MatDialogModule } from '@angular/material/dialog';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  COLUMN_DEFS,
  DISPLAY_COLUMN_ROLE,
  DISPLAY_ROLES,
  ITEM_OF_PAGE,
} from '@app/constants/shared.constant';
import { getManagerName as _getManagerName } from '@app/helper/get-manager-name';
import { SnackbarService } from '@app/services/snackbar.service';
import { ModalService } from '@app/services/modal.service';
import { FilterComponent } from '@app/shares/filter/filter.component';
import { FileService } from '@app/services/fileService.service';
import { SelectOptioncomponent } from '@app/shares/select-option/select-option.component';
import { getEndpoints } from '@app/constants/endpoints.constant';
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
  displayedColumns: string[] = DISPLAY_COLUMN_ROLE;
  columnDefs: HeaderColumn[] = COLUMN_DEFS;
  displayRole = DISPLAY_ROLES;

  dataSource!: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  onSearch(searchKeyword: string) {
    this.userService.getListUser().subscribe({
      next: (data) => {
        const { users } = data;
        if (searchKeyword !== '') {
          this.employees = users.filter(
            (u) =>
              u.username?.includes(searchKeyword) ||
              u.email.includes(searchKeyword),
          );
        } else {
          this.employees = users;
        }
        this.dataSource.data = this.employees;
      },
      error: (err) => {
        this.snackbarservice.openSnackBar('Search failed: ' + err.message);
      },
    });
  }
  constructor(
    private userService: UserService,
    private snackbarservice: SnackbarService,
    private modalService: ModalService,
    private fileService: FileService,
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
      const { users } = data;
      this.employees = users;
      this.dataSource.data = users;
    });
  }

  openDialog() {
    this.modalService.openFilter(
      ModalDiaLogComponent,
      SelectOptioncomponent,
      'Select option',
      {
        action: 'select',
        dataSelected: null,
        dataList: this.employees,
        message: '',
        from: 'user-management',
      },
    );
  }
  onRowClick(row: User) {
    this.modalService
      .openFilter(ModalDiaLogComponent, UserForm, 'Edit user', {
        action: 'update',
        dataSelected: row,
        dataList: this.employees,
        message: '',
        from: 'user-management',
      })
      .subscribe(() => {
        this.ngOnInit();
      });
  }

  openFilter() {
    this.modalService
      .openFilter(ModalDiaLogComponent, FilterComponent, 'Filter by', {
        action: '#',
        dataSelected: null,
        dataList: [],
        message: '',
        from: 'user-management',
      })
      .subscribe((result) => {
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

  exportToFileCSV() {
    const endpoint = getEndpoints().user.v1.download_user;
    this.fileService.downloadFile(endpoint).subscribe((res) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_management.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
