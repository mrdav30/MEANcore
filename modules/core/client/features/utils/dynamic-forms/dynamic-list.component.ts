
import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { map, split, forEach, findIndex, filter, find } from 'lodash';

import { QuestionBase } from './dynamic-questions/models/question-base';

@Component({
  moduleId: module.id,
  selector: 'app-dynamic-list',
  templateUrl: `dynamic-list.component.html`
})

export class DynamicListComponent implements AfterViewInit {
  @Input() listTitle: string;
  @Input() items: any[];
  @Input() allItems: any[];
  @Input() itemsMetadata: QuestionBase<any>[];
  @Input() viewingMetadata: QuestionBase<any>[];
  @Input() createMetadata: QuestionBase<any>[];
  @Input() showCheckboxes: boolean;
  @Input() isReadOnly: boolean;
  @Input() isToggle: boolean;
  @Output() itemSelect = new EventEmitter();
  @Output() itemView = new EventEmitter();
  @Output() listSelect = new EventEmitter();
  @Output() itemStartEdit = new EventEmitter();
  @Output() itemChanges = new EventEmitter();
  @Output() itemDelete = new EventEmitter();
  @Output() itemCreate = new EventEmitter();
  @Output() itemAdd = new EventEmitter();
  @Output() itemRemove = new EventEmitter();

  selectedItem: any = null;
  selectedList: any = null;
  editingItem = false;
  creatingItem = false;
  displayItems: any[];
  aboutToDeleteItem: any = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.allItems) {
        this.allItems = this.items;
        this.items = [];
      }
      this.allItems = this.allItems.sort((i1, i2) => i1.name.localeCompare(i2.name));
    });
  }

  canShowCheckboxes(): boolean {
    return this.showCheckboxes && this.allItems.length > 0;
  }

  _getMetadata(item: any, meta: any): any[] {
    return map(meta, (obj) => {
      const parts = split(obj.key, '.');
      let val = item;
      forEach(parts, (part) => {
        val = val[part];
      });
      obj.value = val;
      return obj;
    });
  }

  getMetadata(item: any): any[] {
    return this._getMetadata(item, this.itemsMetadata);
  }

  getCreateMetadata(): any[] {
    return this._getMetadata(null, this.createMetadata);
  }

  getViewMetadata(item: any): any[] {
    return this._getMetadata(item, this.viewingMetadata);
  }

  cleanMetadata(): any[] {
    return map(this.itemsMetadata, (obj) => {
      obj.value = '';
      return obj;
    });
  }

  toggleItem(item: any): void {
    this.aboutToDeleteItem = null;
    if (this.isSelected(item) && !this.editingItem) {
      this.itemSelect.emit(this.selectedItem);
      this.selectedItem = null;
    } else {
      this.editingItem = false;
      this.selectedItem = item;
      this.itemSelect.emit(this.selectedItem);
    }
  }

  toggleItemSelection(item: any): void {
    this.aboutToDeleteItem = null;
    // Set timeout to allow selection to propagate
    //  setTimeout(() => {
    if (!this.isChecked(item)) {
      this.itemAdd.emit(item);
    } else {
      this.itemRemove.emit(item);
    }
    // });
  }

  toggleCreateItem(): void {
    // TODO validation if editing
    this.aboutToDeleteItem = null;
    this.selectedItem = false;
    this.creatingItem = !this.creatingItem;
    if (this.creatingItem) {
      this.itemStartEdit.emit();
    }
  }

  toggleEditItem(item: any): void {
    this.aboutToDeleteItem = null;
    this.editingItem = true;
    this.creatingItem = false;
    this.itemStartEdit.emit();
    this.selectedItem = item;
  }

  isSelected(item: any): boolean {
    return this.selectedItem === item;
  }

  isChecked(item: any): boolean {
    if (!this.items) {
      return false;
    }
    return findIndex(this.items, (i) => i._id === item._id) >= 0;
  }

  onCreate(item: any): void {
    this.itemCreate.emit(item);
    this.creatingItem = false;
  }

  onCloseForm(): void {
    this.selectedItem = null;
    this.editingItem = false;
    this.creatingItem = false;
  }

  onModify(item: any): void {
    this.itemChanges.emit(item);
    this.editingItem = false;
  }

  onDelete(item: any): void {
    this.selectedItem = null;
    this.editingItem = false;
    if (!this.aboutToDeleteItem || this.aboutToDeleteItem !== item) {
      this.aboutToDeleteItem = item;
    } else if (this.aboutToDeleteItem === item) {
      this.aboutToDeleteItem = null;
      this.itemDelete.emit(item);
    }
  }

  getLists(item: any): any[] {
    const keys: any[] = Object.keys(item);
    const arrayKeys = filter(keys, (key) => Array.isArray(item[key]));
    return map(arrayKeys, (key) => ({ name: key, items: item[key] }));
  }

  getFirstListCount(item: any): number {
    const lists = this.getLists(item);
    if (lists.length > 0) {
      const el = find(this.items, (i) => i._id === item._id);
      if (el && el[lists[0].name]) {
        return el[lists[0].name].length;
      }
    }

    return 0;
  }

  hasMultipleLists(item: any): boolean {
    return this.getLists(item).length > 1;
  }

  toggleList(list: any): void {
    if (this.selectedList === list) {
      this.listSelect.emit(this.selectedList);
      this.selectedList = [];
    } else {
      this.selectedList = list;
      this.listSelect.emit(this.selectedList);
    }
  }
}
