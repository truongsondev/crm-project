import { Component, ViewChild } from '@angular/core';
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
import { ModalDiaLogComponent } from '@app/shares/modal/modal.component';
import { ContactForm } from '@app/form/contacts/contact.form';
import { User } from '@app/interfaces/user.interface';
import { UserService } from '@app/services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmActionComponent } from '@app/shares/confirm-action/confirm-action.component';
import { FilterComponent } from '@app/shares/filter/filter.component';
import { ModalService } from '@app/services/modal.service';
import { ITEM_OF_PAGE } from '@app/constants/shared.constant';
import { SnackbarService } from '@app/services/snackbar.service';
import { FileService } from '@app/services/fileService.service';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { SelectOptioncomponent } from '@app/shares/select-option/select-option.component';

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
    private userService: UserService,
    private modalService: ModalService,
    private snackbarservice: SnackbarService,
    private fileService: FileService,
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
        message: '',
        from: 'contact',
      })
      .subscribe((res) => {
        this.contacts = res.contacts;
        this.dataSource.data = this.contacts;
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
        dataList: this.contacts,
        message: '',
        from: 'contact',
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
        message: '',
        from: 'contact',
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
        message: '',
        from: 'contact',
      },
    );
  }
  exportToFileCSV() {
    const endpoint = getEndpoints().contact.v1.download_contact;
    this.fileService.downloadFile(endpoint).subscribe((res) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contact.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
