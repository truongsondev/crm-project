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
  ],
  providers: [DatePipe],
})
export class ContactComponent {
  contacts: Contact[] = [];
  mySearch: string = 'contact name';

  dataSource!: MatTableDataSource<Contact>;
  displayedColumns: string[] = [
    'contact_name',
    'salutation',
    'lead_source',
    'assigned_to',
    'created_on',
    'updated_on',
    'action',
  ];
  columnDefs: HeaderColumn[] = [
    { column: 'contact_name', label: 'Contact Name' },
    { column: 'salutation', label: 'Salutation' },
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
      this.contactService
        .getListContact({ contact_name: event })
        .subscribe((data) => {
          this.contacts = data;
          this.dataSource.data = data;
        });
    } else {
      this.contactService.getListContact('').subscribe((data) => {
        this.contacts = data;
        this.dataSource.data = data;
      });
    }
  }

  constructor(
    private contactService: ContactService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.contactService.getListContact('').subscribe((res) => {
      this.contacts = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
}
