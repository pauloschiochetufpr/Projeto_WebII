import { Injectable } from '@angular/core';

export type DateValue = Date | null;
export type DateRangeValue = { start: Date; end: Date } | null;

@Injectable({
  providedIn: 'root',
})
export class DateSelection {
  private singleDate: DateValue = null;
  private rangeDate: DateRangeValue = null;

  // -------- Single Date ----------
  setDate(date: DateValue) {
    this.singleDate = date;
  }

  getDate(): DateValue {
    return this.singleDate;
  }

  // -------- Range Date ----------
  setRange(range: DateRangeValue) {
    this.rangeDate = range;
  }

  getRange(): DateRangeValue {
    return this.rangeDate;
  }

  // -------- Save Date ----------
  saveDate(date: Date | Date[]) {
    console.log('Data recebida no service:', date);
    // futuramente aqui entra o código para salvar no banco
  }
}
