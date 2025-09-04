import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatDatepickerModule,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
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

  // recebe o evento do MatDatepicker; event.value: Date | null
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date = event.value ?? null;
    // atualiza o estado no service
    this.dateService.setDate(date);

    // só tenta salvar/logar se houver uma data válida
    if (date) {
      this.dateService.saveDate(date);
      console.log('DatePicker - data selecionada:', date);
    } else {
      console.log('DatePicker - valor nulo/limpo');
    }
  }
}
