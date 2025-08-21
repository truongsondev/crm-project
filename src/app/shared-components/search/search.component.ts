import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'search-component',
  templateUrl: './search.component.html',
  imports: [FormsModule],
})
export class SearchComponent {
  searchText: string = '';
  @Output() search = new EventEmitter();
  @Input() titleSearch: string = '';
  valueChange() {
    this.search.emit(this.searchText);
  }
}
