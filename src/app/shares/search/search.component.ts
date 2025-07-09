import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
@Component({
  standalone: true,
  selector: 'search-component',
  templateUrl: './search.component.html',
  imports: [MatIconModule, FormsModule],
})
export class SearchComponent {
  searchText: string = '';
  @Output() testFn = new EventEmitter();

  valueChange() {
    this.testFn.emit(this.searchText);
  }
}
