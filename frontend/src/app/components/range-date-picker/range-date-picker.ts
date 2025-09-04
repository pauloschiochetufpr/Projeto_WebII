import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerModule,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
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
  constructor(public dateSelection: DateSelection) {}

  // handler para o input de start date
  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    const start = event.value ?? null;
    const currentRange = this.dateSelection.getRange() || {
      start: null,
      end: null,
    };
    const newRange = { start, end: currentRange.end };
    this.dateSelection.setRange(newRange);

    // só salva quando os dois valores estiverem definidos
    if (newRange.start && newRange.end) {
      this.dateSelection.saveDate([newRange.start, newRange.end]);
      console.log('Range completo salvo (start):', [
        newRange.start,
        newRange.end,
      ]);
    } else {
      console.log('Start selecionado (aguardando end):', start);
    }
  }

  // handler para o input de end date
  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    const end = event.value ?? null;
    const currentRange = this.dateSelection.getRange() || {
      start: null,
      end: null,
    };
    const newRange = { start: currentRange.start, end };
    this.dateSelection.setRange(newRange);

    // só salva quando os dois valores estiverem definidos
    if (newRange.start && newRange.end) {
      this.dateSelection.saveDate([newRange.start, newRange.end]);
      console.log('Range completo salvo (end):', [
        newRange.start,
        newRange.end,
      ]);
    } else {
      console.log('End selecionado (aguardando start):', end);
    }
  }

  onDateChange(date: Date) {
    this.dateSelection.setDate(date);
    this.dateSelection.saveDate(date);
    console.log('Data única selecionada:', date);
  }

  saveCurrent() {
    const range = this.dateSelection.getRange();
    const single = this.dateSelection.getDate();
    if (range && (range.start || range.end)) {
      this.dateSelection.saveDate(range);
      console.log('Salvando range atual (botão):', range);
    } else if (single) {
      this.dateSelection.saveDate(single);
      console.log('Salvando single date atual (botão):', single);
    } else {
      console.log('Nenhuma data definida para salvar.');
    }
  }
}
