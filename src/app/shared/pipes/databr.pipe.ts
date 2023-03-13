import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Pipe({
  name: 'dataBr',
})
export class DataBrPipe extends DatePipe implements PipeTransform {
  /* transform(date: Date): any {
    return moment.parseZone(date).format('DD/MM/YYYY');
  }*/
}
