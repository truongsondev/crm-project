import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeaderColumn } from '@app/custom-types/shared.type';
import { Contact } from '@app/interfaces/contact.interface';
import { ContactService } from '@app/services/contact.service';
import { SearchComponent } from '@app/shares/search/search.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalDiaLogComponent } from '@app/shares/modal/modal.component';
import { ContactForm } from '@app/form/contacts/contact.form';
import { User } from '@app/interfaces/user.interface';
import { UserService } from '@app/services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmActionComponent } from '@app/shares/confirm-action.component/confirm-action.component';
import { FilterComponent } from '@app/shares/filter.component.ts/filter.component';
import { ModalService } from '@app/services/modal.service';
import { ITEM_OF_PAGE } from '@app/constants/shared.constant';
import { SnackbarService } from '@app/services/snackbar.service';

@Component({
  selector: 'contact-component',
  templateUrl: './contact.component.html',
  imports: [
    MatIconModule,
    SearchComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatCheckboxModule,
  ],
  providers: [DatePipe],
})
export class ContactComponent {
  contacts: Contact[] = [];
  mySearch: string = 'contact name';
  users: User[] = [];
  pageSize = ITEM_OF_PAGE;
  pageIndex = 0;
  Math = Math;
  dataSource!: MatTableDataSource<Contact>;
  displayedColumns: string[] = [
    'all',
    'contact_name',
    'lead_source',
    'assigned_to',
    'created_on',
    'updated_on',
    'action',
  ];
  columnDefs: HeaderColumn[] = [
    { column: 'all', label: 'All' },
    { column: 'contact_name', label: 'Contact Name' },
    { column: 'lead_source', label: 'Lead Source' },
    { column: 'assigned_to', label: 'Assigned to' },
    { column: 'created_on', label: 'Created On' },
    { column: 'updated_on', label: 'Updated On' },
    { column: 'action', label: 'Action' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  onSearch(searchKeyword: string) {
    this.contactService.getListContact().subscribe({
      next: (data) => {
        const { contacts } = data;

        if (searchKeyword !== '') {
          this.contacts = contacts.filter((u) =>
            u.contact_name?.includes(searchKeyword),
          );
        } else {
          this.contacts = contacts;
        }
        this.dataSource.data = this.contacts;
      },
      error: (err) => {
        this.snackbarservice.openSnackBar('Search failed: ' + err.message);
      },
    });
  }

  constructor(
    private contactService: ContactService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private userService: UserService,
    private modalService: ModalService,
    private snackbarservice: SnackbarService,
  ) {}
  ngOnInit() {
    this.contactService.getListContact().subscribe((res) => {
      const { contacts } = res;

      this.contacts = contacts;
      this.dataSource = new MatTableDataSource(contacts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.userService.getListUser().subscribe((res) => {
      const { users } = res;
      this.users = users;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFormattedDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  getNameUser(id: string): string {
    const name = this.users.find((item) => item._id === id);
    if (!name) {
      return '-';
    }
    return name?.first_name + ' ' + name?.last_name;
  }
  openFilter() {
    this.modalService
      .openFilter(ModalDiaLogComponent, FilterComponent, 'Filter by', {
        action: '#',
        dataSelected: null,
        dataList: [],
      })
      .subscribe((res) => {
        // if (!res) {
        //   return;
        // }
        this.contacts = res;
        this.dataSource.data = this.contacts;
      });
  }
  openDialog() {
    this.modalService.openFilter(
      ModalDiaLogComponent,
      ContactForm,
      'Add contact',
      {
        action: '#',
        dataSelected: null,
        dataList: this.contacts,
      },
    );
  }

  onRowClick(row: Contact) {
    this.modalService.openFilter(
      ModalDiaLogComponent,
      ContactForm,
      'Edit contact',
      {
        action: 'update',
        dataSelected: row,
        dataList: this.contacts,
      },
    );
  }

  onDelete(row: Contact) {
    this.modalService.openFilter(
      ModalDiaLogComponent,
      ConfirmActionComponent,
      'Edit contact',
      {
        action: 'Confirm delete',
        dataSelected: row,
        dataList: this.contacts,
      },
    );
  }
}
