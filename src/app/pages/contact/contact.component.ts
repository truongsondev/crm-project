import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeaderColumn } from '@app/custom-types/shared.type';
import { Contact } from '@app/interfaces/contact.interface';
import { ContactService } from '@app/services/contact.service';
import { SearchComponent } from '@app/shared-components/search/search.component';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalDiaLogComponent } from '@app/shared-components/modal/modal.component';
import { ContactForm } from '@app/pages/contact/components/contact-form/contact.component';
import { User } from '@app/interfaces/user.interface';
import { UserService } from '@app/services/user.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmActionComponent } from '@app/shared-components/confirm-action/confirm-action.component';
import { ModalService } from '@app/services/modal.service';
import { ACTION, ITEM_OF_PAGE } from '@app/constants/shared.constant';
import { SnackbarService } from '@app/services/snackbar.service';
import { FileService } from '@app/services/file.service';
import { getEndpoints } from '@app/constants/endpoints.constant';
import { SelectOptioncomponent } from '@app/shared-components/select-option/select-option.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@app/shared-components/button/button.component';
import { OPENDED_FORM_ENUM } from '@app/enums/shared.enum';
import { ContactFilterComponent } from './components/contact-filter/contact.component';
import { combineLatestWith, map, Observable } from 'rxjs';

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
    FormsModule,
    ButtonComponent,
  ],
  providers: [DatePipe],
})
export class ContactComponent {
  contactList: Contact[] = [];
  mySearch: string = 'contact name';
  users: User[] = [];
  pageSize = ITEM_OF_PAGE;
  pageIndex = 0;
  lengthDatasource = 0;
  Math = Math;
  listDelete: string[] = [];
  allSelected = false;
  dataSource = new MatTableDataSource<Contact>();
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
        const contacts = data;

        if (searchKeyword !== '') {
          this.contactList = contacts.filter((u) =>
            u.contact_name?.includes(searchKeyword.trim()),
          );
        } else {
          this.contactList = contacts;
        }
        this.dataSource.data = this.contactList;
      },
      error: (err) => {
        this.snackbarservice.openSnackBar('Search failed: ' + err.message);
      },
    });
  }

  constructor(
    private contactService: ContactService,
    private userService: UserService,
    private modalService: ModalService,
    private snackbarservice: SnackbarService,
    private fileService: FileService,
  ) {}
  ngOnInit() {
    this.getListContact();
    this.userService.getListUser().subscribe((res) => {
      const users = res;
      this.users = users;
    });
  }

  getListContact(filterVal?: Observable<any>) {
    const contacts$ = this.contactService.getListContact();
    let result$: Observable<Contact[]> = contacts$;
    if (filterVal) {
      result$ = filterVal.pipe(
        combineLatestWith(contacts$),
        map(
          ([
            {
              assignedTo,
              leadSource,
              createdDateFrom,
              createdDateTo,
              updatedDateFrom,
              updatedDateTo,
            },
            contactData,
          ]) => {
            const source = contactData.filter((contact: Contact) => {
              return (
                (assignedTo ? contact.assigned_to === assignedTo : true) &&
                (leadSource ? contact.lead_source === leadSource : true) &&
                (createdDateFrom
                  ? new Date(contact.created_on) >= createdDateFrom
                  : true) &&
                (createdDateTo
                  ? new Date(contact.created_on) <= createdDateTo
                  : true) &&
                (updatedDateFrom
                  ? new Date(contact.updated_on) >= updatedDateFrom
                  : true) &&
                (updatedDateTo
                  ? new Date(contact.updated_on) <= updatedDateTo
                  : true)
              );
            });
            return source;
          },
        ),
      );
    }
    result$.subscribe((data: Contact[]) => {
      if (data) {
        const contacts = data;

        this.contactList = contacts;
        this.dataSource.data = contacts;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  insertListDelete(contact: Contact) {
    if (contact.isChecked) {
      if (!this.listDelete.includes(contact._id)) {
        this.listDelete.push(contact._id);
      }
    } else {
      this.listDelete = this.listDelete.filter((id) => id !== contact._id);
    }
    console.log(this.listDelete);
  }

  onRowChange() {
    this.allSelected = this.contactList.every((c) => c.isChecked);
    this.listDelete = this.contactList
      .filter((c) => c.isChecked)
      .map((c) => c._id);
  }
  selectAllContacts(checked: boolean) {
    this.contactList.forEach((contact) => (contact.isChecked = checked));

    if (checked) {
      this.listDelete = this.contactList.map((contact) => contact._id);
    } else {
      this.listDelete = [];
    }
    console.log(this.listDelete);
  }
  deleteMany() {
    if (this.listDelete.length > 0) {
      this.contactService.deleteContacts(this.listDelete).subscribe(() => {
        this.snackbarservice.openSnackBar('Delete success');
        this.getListContact();
        this.allSelected = false;
      });
    } else {
      this.snackbarservice.openSnackBar('You not select contact');
    }
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
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
      .openModal(ModalDiaLogComponent, ContactFilterComponent, 'Filter by', {
        action: '#',
        dataSelected: null,
        dataList: [],
        message: '',
        from: OPENDED_FORM_ENUM.CONTACT,
      })
      .subscribe((res) => {
        this.getListContact(res.filterSubject);
      });
  }
  openDialog() {
    this.modalService
      .openModal(ModalDiaLogComponent, SelectOptioncomponent, 'Select option', {
        action: 'select',
        dataSelected: null,
        dataList: this.contactList,
        message: '',
        from: OPENDED_FORM_ENUM.CONTACT,
      })
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getListContact();
        }
      });
  }

  onRowClick(row: Contact) {
    this.modalService
      .openModal(ModalDiaLogComponent, ContactForm, 'Edit contact', {
        action: 'update',
        dataSelected: row,
        dataList: this.contactList,
        message: '',
        from: OPENDED_FORM_ENUM.CONTACT,
      })
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getListContact();
        }
      });
  }

  onDelete(row: Contact) {
    this.modalService
      .openModal(
        ModalDiaLogComponent,
        ConfirmActionComponent,
        'Delete contact',
        {
          action: ACTION.NONE,
          dataSelected: row,
          dataList: this.contactList,
          message: '',
          from: OPENDED_FORM_ENUM.CONTACT,
        },
      )
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getListContact();
        }
      });
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
