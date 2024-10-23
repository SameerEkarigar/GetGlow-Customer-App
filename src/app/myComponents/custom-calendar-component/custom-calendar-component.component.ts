import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { IonicModule } from '@ionic/angular'; 
@Component({
  selector: 'app-custom-calendar-component',
  templateUrl: './custom-calendar-component.component.html',
  styleUrls: ['./custom-calendar-component.component.scss'],
})
export class CustomCalendarComponentComponent  implements OnInit {

  currentDate = new Date();
  monthYear = '';
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dates: { day: number; classes: string }[] = [];

  ngOnInit() {
    this.renderCalendar();
  }

  changeMonth(monthChange: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + monthChange);
    this.renderCalendar();
  }

  renderCalendar() {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const prevLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0);

    this.monthYear = `${firstDay.toLocaleString('default', { month: 'long' })} ${firstDay.getFullYear()}`;

    this.dates = [];

    // Fill previous month's dates
    for (let i = firstDay.getDay(); i > 0; i--) {
      this.dates.push({
        day: prevLastDay.getDate() - i + 1,
        classes: 'other-month'
      });
    }

    // Fill current month's dates
    for (let i = 1; i <= lastDay.getDate(); i++) {
      let classes = 'current-month';
      if (
        i === new Date().getDate() &&
        this.currentDate.getMonth() === new Date().getMonth() &&
        this.currentDate.getFullYear() === new Date().getFullYear()
      ) {
        classes += ' today';
      }
      this.dates.push({ day: i, classes });
    }

    // Fill next month's dates
    const nextDays = 42 - this.dates.length;
    for (let i = 1; i <= nextDays; i++) {
      this.dates.push({
        day: i,
        classes: 'other-month'
      });
    }
  }
}
