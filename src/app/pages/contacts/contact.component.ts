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
import { UserForm } from '@app/form/user/user.form';

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

  onSearch(event: string) {
    if (event !== '') {
      this.contactService.getListContact().subscribe((data) => {
        const { code, contacts } = data;
        if (code === 20000) {
          this.contacts = contacts;
          this.dataSource.data = contacts;
        }
      });
    }
  }

  constructor(
    private contactService: ContactService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private userService: UserService,
  ) {}
  ngOnInit() {
    this.contactService.getListContact().subscribe((res) => {
      const { code, contacts } = res;

      if (code === 200000) {
        this.contacts = contacts;
        this.dataSource = new MatTableDataSource(contacts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

    this.userService.getListUser().subscribe((res) => {
      const { code, users } = res;

      if (code === 200000) {
        this.users = users;
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

  openDialog() {
    this.dialog.open(ModalDiaLogComponent, {
      data: {
        component: ContactForm,
        title: 'Add contact',
        metadata: {
          user: this.contacts,
          action: 'create',
        },
      },
    });
  }

  onRowClick(row: Contact) {
    this.dialog.open(ModalDiaLogComponent, {
      data: {
        component: ContactForm,
        title: 'Edit contact',
        metadata: {
          action: 'update',
          dataSelected: row,
          contactList: this.contacts,
        },
      },
    });
  }
}
