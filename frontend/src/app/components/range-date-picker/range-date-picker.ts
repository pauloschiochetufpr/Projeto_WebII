import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateSelection } from '../../services/date-selection';

@Component({
  selector: 'rangeDatePicker',
  imports: [MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-date-picker.html',
  styleUrl: './range-date-picker.css',
})
export class RangeDatePicker {
  constructor(private dateService: DateSelection) {}
}
