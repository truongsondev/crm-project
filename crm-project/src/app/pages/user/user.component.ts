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
import { UserForm } from './components/user-form/user.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DISPLAY_ROLES, ITEM_OF_PAGE } from '@app/constants/shared.constant';
import { SnackbarService } from '@app/services/snackbar.service';
import { ModalService } from '@app/services/modal.service';
import { FileService } from '@app/services/file.service';
import { SelectOptionComponent } from '@app/shared-components/select-option/select-option.component';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { ButtonComponent } from '@app/shared-components/button/button.component';
import { ACTION } from '@app/constants/shared.constant';
import { OPENDED_FROM_ENUM } from '@app/enums/shared.enum';
import { UserFilterComponent } from './components/user-filter/user-filter.component';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { combineLatestWith } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';

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
    TranslatePipe,
  ],
})
export class UserManagementComponent implements AfterViewInit {
  userList: User[] = [];
  mySearch: string = 'user/email';
  pageSize = ITEM_OF_PAGE;
  pageIndex = 0;
  Math = Math;

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  displayedColumns: string[] = [
    'employee',
    'username',
    'email',
    'salutation',
    'role',
    'job_title',
    'manager_name',
    'is_active',
    'action',
  ];
  columnDefs: HeaderColumn[] = [
    { column: 'employee', label: 'Employee' },
    { column: 'username', label: 'Username' },
    { column: 'email', label: 'Email' },
    { column: 'salutation', label: 'Salutation' },
    { column: 'role', label: 'Role' },
    { column: 'job_title', label: 'Job Title' },
    { column: 'manager_name', label: 'Manager' },
    { column: 'is_active', label: 'Active' },
    { column: 'action', label: 'Action' },
  ];
  displayRole = DISPLAY_ROLES;

  dataSource!: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  onSearch(searchKeyword: string) {
    const searchSubject: BehaviorSubject<{ searchKeyword: string }> =
      new BehaviorSubject<{ searchKeyword: string }>({
        searchKeyword: searchKeyword,
      });
    this.getListUser(searchSubject);
    //this.getListUser();
    // this.userService.getListUser().subscribe({
    //   next: (data) => {
    //     const users = data;
    //     if (searchKeyword !== '') {
    //       this.userList = users.filter(
    //         (user: any) =>
    //           user.username?.includes(searchKeyword.trim()) ||
    //           user.email.includes(searchKeyword.trim()),
    //       );
    //     } else {
    //       this.userList = users;
    //     }
    //     this.dataSource.data = this.userList;
    //   },
    //   error: (err) => {
    //     this.snackbarservice.openSnackBar('Search failed: ' + err.message);
    //   },
    // });
  }

  constructor(
    private userService: UserService,
    private snackbarservice: SnackbarService,
    private modalService: ModalService,
    private fileService: FileService,
  ) {
    this.dataSource = new MatTableDataSource(this.userList);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.getListUser();
  }

  getListUser(filterVal?: BehaviorSubject<any>) {
    const user$ = this.userService.getListUser();
    let result$: Observable<User[]> = user$;
    if (filterVal) {
      result$ = filterVal.pipe(
        combineLatestWith(user$),
        map(
          ([
            {
              role,
              createdDateFrom,
              createdDateTo,
              updatedDateFrom,
              updatedDateTo,
              searchKeyword,
            },
            userData,
          ]) => {
            const sourceData = userData.filter((user: User) => {
              return (
                (role ? user.role === role : true) &&
                (createdDateFrom
                  ? new Date(user.created_on) >= createdDateFrom
                  : true) &&
                (createdDateTo
                  ? new Date(user.created_on) <= createdDateTo
                  : true) &&
                (updatedDateFrom
                  ? new Date(user.updated_on) >= updatedDateFrom
                  : true) &&
                (updatedDateTo
                  ? new Date(user.updated_on) <= updatedDateTo
                  : true) &&
                (!searchKeyword ||
                  user.username
                    ?.toLowerCase()
                    .includes(searchKeyword.trim().toLowerCase()) ||
                  user.email
                    .toLowerCase()
                    .includes(searchKeyword.trim().toLowerCase()))
              );
            });
            return sourceData;
          },
        ),
      );
    }

    result$.subscribe((data: User[]) => {
      if (data) {
        const users = data;
        this.userList = users;
        this.dataSource.data = users;
      }
    });
  }

  openDialog() {
    this.modalService
      .openModal(ModalDiaLogComponent, UserForm, 'Add user', {
        action: ACTION.CREATE,
        selectedRow: null,
        dataList: this.userList,
        message: '',
        from: OPENDED_FROM_ENUM.USER_MANAGEMENT,
      })
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getListUser();
        }
      });
  }

  onRowClick(row: User) {
    this.modalService
      .openModal(ModalDiaLogComponent, UserForm, 'Edit user', {
        action: ACTION.UPDATE,
        selectedRow: row,
        dataList: this.userList,
        message: '',
        from: OPENDED_FROM_ENUM.USER_MANAGEMENT,
      })
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getListUser();
        }
      });
  }

  openFilterModal() {
    this.modalService
      .openModal(ModalDiaLogComponent, UserFilterComponent, 'Filter by', {
        action: ACTION.NONE,
        selectedRow: null,
        dataList: [],
        message: '',
        from: OPENDED_FROM_ENUM.USER_MANAGEMENT,
      })
      .subscribe((result) => {
        if (result) {
          this.getListUser(result.filterSubject);
        }
      });
  }

  getDisplayRole(role: string): string {
    const rolekey = role as keyof typeof this.displayRole;
    return this.displayRole[rolekey] || '-';
  }

  exportToFileCSV() {
    const endpoint = getEndpoints().user.v1.downloadUser;
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
