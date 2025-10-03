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
import { SelectOptionComponent } from '@app/shared-components/select-option/select-option.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@app/shared-components/button/button.component';
import { OPENDED_FROM_ENUM } from '@app/enums/shared.enum';
import { ContactFilterComponent } from './components/contact-filter/contact.component';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';

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
    TranslatePipe,
  ],
  providers: [DatePipe],
})
export class ContactComponent {
  contactList: Contact[] = [];
  mySearch: string = 'contact name';
  users: User[] = [];
  pageSize = ITEM_OF_PAGE;
  pageIndex = 0;
  dataSourceLength = 0;
  Math = Math;
  contactsToDelete: string[] = [];
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
    private router: ActivatedRoute,
  ) {}
  ngOnInit() {
    const queryParam = this.router.snapshot.queryParamMap.get('leadSource');
    if (queryParam) {
      const queryParamSubject: BehaviorSubject<{ leadSource: string }> =
        new BehaviorSubject<{ leadSource: string }>({
          leadSource: queryParam,
        });
      this.getContactList(queryParamSubject);
    } else {
      this.getContactList();
    }

    this.userService.getListUser().subscribe((res) => {
      const users = res;
      this.users = users;
    });
  }

  getContactList(filterVal?: Observable<any>) {
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
            const sourceData = contactData.filter((contact: Contact) => {
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
            return sourceData;
          },
        ),
      );
    }
    result$.subscribe((data: Contact[]) => {
      if (data) {
        const contacts = data;

        this.contactList = contacts;
        this.dataSource.data = contacts;
        this.dataSourceLength = this.contactList.length;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  partiallyComplete() {
    return (
      this.contactList.filter((contact) => contact.isChecked === false).length >
      0
    );
  }

  selectAllContacts(checked: boolean) {
    this.allSelected = checked;
    this.contactList.forEach((contact) => (contact.isChecked = checked));
    this.contactsToDelete = checked
      ? this.contactList.map((contact) => contact._id)
      : [];
  }

  toggleContact(contact: Contact) {
    contact.isChecked = !contact.isChecked;
    this.contactsToDelete = this.contactList
      .filter((contact) => contact.isChecked)
      .map((contact) => contact._id);

    this.allSelected = this.contactList.every((contact) => contact.isChecked);
  }

  isIndeterminate(): boolean {
    const selected = this.contactList.filter(
      (contact) => contact.isChecked,
    ).length;
    return selected > 0 && selected < this.contactList.length;
  }

  deleteSelectedContacts() {
    if (this.contactsToDelete.length > 0) {
      this.contactService
        .deleteContacts(this.contactsToDelete)
        .subscribe(() => {
          this.snackbarservice.openSnackBar('Delete success');
          this.getContactList();
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
        action: ACTION.NONE,
        selectedRow: null,
        dataList: [],
        message: '',
        from: OPENDED_FROM_ENUM.CONTACT,
      })
      .subscribe((res) => {
        this.getContactList(res.filterSubject);
      });
  }
  openDialog() {
    this.modalService
      .openModal(ModalDiaLogComponent, SelectOptionComponent, 'Select option', {
        action: ACTION.SELECT,
        selectedRow: null,
        dataList: this.contactList,
        message: '',
        from: OPENDED_FROM_ENUM.CONTACT,
      })
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getContactList();
        }
      });
  }

  onRowClick(row: Contact) {
    this.modalService
      .openModal(ModalDiaLogComponent, ContactForm, 'Edit contact', {
        action: ACTION.UPDATE,
        selectedRow: row,
        dataList: this.contactList,
        message: '',
        from: OPENDED_FROM_ENUM.CONTACT,
      })
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getContactList();
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
          selectedRow: row,
          dataList: this.contactList,
          message: '',
          from: OPENDED_FROM_ENUM.CONTACT,
        },
      )
      .subscribe((res) => {
        if (res && res.isSubmit === true) {
          this.getContactList();
        }
      });
  }
  exportToFileCSV() {
    const endpoint = getEndpoints().contact.v1.downloadContact;
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
