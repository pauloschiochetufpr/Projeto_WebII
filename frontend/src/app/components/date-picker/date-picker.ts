import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateSelection } from '../../services/date-selection';

@Component({
  selector: 'datePicker',
  templateUrl: 'date-picker.html',
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
})
export class DatePicker {
  constructor(private dateService: DateSelection) {}

  onDateChange(date: Date) {
    this.dateService.setDate(date);
  }
}
