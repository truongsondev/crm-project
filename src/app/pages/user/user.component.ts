import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SearchComponent } from '@app/shared-components/search/search.component';
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
import { ModalDiaLogComponent } from '@app/shared-components/modal/modal.component';
import { UserForm } from '@app/pages/user/components/user-form/user.form';
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
import { SnackbarService } from '@app/services/snackbar.service';
import { ModalService } from '@app/services/modal.service';
import { FileService } from '@app/services/file.service';
import { SelectOptioncomponent } from '@app/shared-components/select-option/select-option.component';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { ButtonComponent } from '@app/shared-components/button/button.component';
import { ACTION } from '@app/constants/shared.constant';
import { OPENDED_FORM_ENUM } from '@app/enums/shared.enum';
import { UserFilterComponent } from './components/user-filter/user-filter.filter';
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

    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    ButtonComponent,
  ],
})
export class UserManagementComponent implements AfterViewInit {
  users: User[] = [];
  mySearch: string = 'user/email';
  pageSize = ITEM_OF_PAGE;
  pageIndex = 0;
  Math = Math;

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
          this.users = users.filter(
            (u) =>
              u.username?.includes(searchKeyword.trim()) ||
              u.email.includes(searchKeyword.trim()),
          );
        } else {
          this.users = users;
        }
        this.dataSource.data = this.users;
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
    this.dataSource = new MatTableDataSource(this.users);
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
    this.getListUser();
  }

  getListUser() {
    this.userService.getListUser().subscribe((data) => {
      const { users } = data;
      this.users = users;
      this.dataSource.data = users;
    });
  }

  openDialog() {
    this.modalService
      .openModal(ModalDiaLogComponent, SelectOptioncomponent, 'Select option', {
        action: ACTION.SELECT,
        dataSelected: null,
        dataList: this.users,
        message: '',
        from: OPENDED_FORM_ENUM.USER_MANAGEMENT,
      })
      .subscribe((res) => {
        if (res.isSubmit === true) {
          this.getListUser();
        }
      });
  }
  onRowClick(row: User) {
    this.modalService
      .openModal(ModalDiaLogComponent, UserForm, 'Edit user', {
        action: ACTION.UPDATE,
        dataSelected: row,
        dataList: this.users,
        message: '',
        from: OPENDED_FORM_ENUM.USER_MANAGEMENT,
      })
      .subscribe((res) => {
        console.log(res.isSubmit);
        if (res.isSubmit === true) {
          this.getListUser();
        }
      });
  }

  openFilter() {
    this.modalService
      .openModal(ModalDiaLogComponent, UserFilterComponent, 'Filter by', {
        action: ACTION.NONE,
        dataSelected: null,
        dataList: [],
        message: '',
        from: OPENDED_FORM_ENUM.USER_MANAGEMENT,
      })
      .subscribe((result) => {
        if (result) {
          this.users = result.users;
          this.dataSource.data = result.users;
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
