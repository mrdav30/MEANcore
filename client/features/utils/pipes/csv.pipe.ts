import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'csv' })
export class CsvPipe implements PipeTransform {
    transform(array) {
        if (!array) {
            return;
        } else {
            return array.toString().replace(/,/g, ', ');
        }
    }
}
