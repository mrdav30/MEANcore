
import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';

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
  displayItems: any[];  // { item: ?, selected: ? }
  aboutToDeleteItem: any = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.allItems) {
        this.allItems = this.items;
        this.items = [];
      }
      this.allItems = this.allItems.sort((i1, i2) => i1.name.localeCompare(i2.name));
      // this.refreshDisplayItems();
    });
  }

  refreshDisplayItems(): void {
    this.displayItems = [];
    if (this.items && this.allItems) {
      // items = subset of allItems
      _.forEach(this.allItems, (item) => {
        const current_item = {
          data: item,
          selected: false
        };
        const foundIndex = _.findIndex(this.items, (i) => i._id === current_item.data._id);
        if (foundIndex >= 0) {
          // existing item in items list
          const foundItem = this.items[foundIndex];
          _.forEach(Object.keys(foundItem), (key) => {
            if (Array.isArray(current_item.data[key])) {
              _.forEach(foundItem[key], (el) => {
                const idx = _.findIndex(current_item.data[key], (i: any) => i._id === el._id);
                if (idx >= 0) {
                  current_item.data[key][idx].data = el;
                  current_item.data[key][idx].selected = true;
                }
              });
            } else {
              current_item.data[key] = foundItem[key];
            }
          });

          current_item.selected = true;

          // TODO: REVIEW? -> marking existing item list items as selected for badge display
          /*var lists = this.getLists(current_item);
          lists.forEach(list => {
            current_item[list.name] = list.items.map(v => {
              v._selected = true;
              return v;
            });
          });*/

        } else { // nonexisting item on items list
          current_item.selected = false;
        }

        this.displayItems.push(current_item);
      });
    } else {
      const list = this.items ? this.items : this.allItems;
      this.displayItems = _.map(list, (i) => ({ data: i, selected: false }));
    }
  }

  canShowCheckboxes(): boolean {
    return this.showCheckboxes && this.allItems.length > 0;
  }

  _getMetadata(item: any, meta: any): any[] {
    return _.map(meta, (obj) => {
      const parts = _.split(obj.key, '.');
      let val = item;
      _.forEach(parts, (part) => {
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
    return _.map(this.itemsMetadata, (obj) => {
      obj.value = '';
      return obj;
    });
  }

  toggleItem(item: any): void {
    this.clearAboutToDelete();
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
    this.clearAboutToDelete();
    // Set timeout to allow selection to propagate
    setTimeout(() => {
      if (!this.isChecked(item)) {
        this.itemAdd.emit(item);
      } else {
        this.itemRemove.emit(item);
      }
    });
  }

  toggleCreateItem(): void {
    // TODO validation if editing
    this.clearAboutToDelete();
    this.selectedItem = false;
    this.creatingItem = !this.creatingItem;
    if (this.creatingItem) {
      this.itemStartEdit.emit();
    }
  }

  toggleEditItem(item: any): void {
    this.clearAboutToDelete();
    this.editingItem = !this.editingItem;
    if (this.editingItem) {
      this.creatingItem = false;
      this.itemStartEdit.emit();
      this.selectedItem = item;
    } else {
      this.selectedItem = null;
    }
  }

  isSelected(item: any): boolean {
    return this.selectedItem === item;
  }

  isChecked(item: any): boolean {
    if (!this.items) {
      return false;
    }
    return this.items.findIndex(i => i.id === item.id) >= 0;
  }

  onCreate(item: any): void {
    this.itemCreate.emit(item);
    this.creatingItem = false;
  }

  onModify(item: any): void {
    this.itemChanges.emit(item);
    this.editingItem = false;
  }

  onDelete(item: any): void {
    if (!this.aboutToDeleteItem || this.aboutToDeleteItem !== item) {
      this.aboutToDeleteItem = item;
    } else if (this.aboutToDeleteItem === item) {
      this.clearAboutToDelete();
      this.itemDelete.emit(item);
    }
  }

  clearAboutToDelete(): void {
    this.aboutToDeleteItem = null;
  }

  getLists(item: any): any[] {
    const keys: any[] = Object.keys(item);
    const arrayKeys = _.filter(keys, (key) => Array.isArray(item[key]));
    return _.map(arrayKeys, (key) => ({ name: key, items: item[key] }));
  }

  getFirstListCount(item: any): number {
    const lists = this.getLists(item);
    if (lists.length > 0) {
      const el = this.items.find(i => i.id === item.id);
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
