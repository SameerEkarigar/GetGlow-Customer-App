import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  // transform(items: any[], searchText: string): any[] {
  //   if (!items || !searchText) {
  //     return items;
  //   }
  //   const lowerCaseSearchText = searchText.toLowerCase();
  //   return items.filter(item => {
  //     return Object.values(item).some(value => 
  //       typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchText)
  //     );
  //   });
  // }
  transform(items: any[], searchText: string): any[] {
    if (!Array.isArray(items) || !searchText) {
      return items; // Return original if not an array or no search text
    }

    const lowerCaseSearchText = searchText.toLowerCase();

    return items.filter(item => {
      return (item.category_name && item.category_name.toLowerCase().includes(lowerCaseSearchText)) ||
             (item.name && item.name.toLowerCase().includes(lowerCaseSearchText)) ||
             (item.sv_name && item.sv_name.toLowerCase().includes(lowerCaseSearchText));
    });
  }
 
}
