import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'knowMoreModal',
  standalone: true
})
export class KnowMoreModalPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
