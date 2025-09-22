import { Injectable } from '@angular/core';

export type DateValue = Date | null;
// permitir start/end serem Date | null
export type DateRangeValue = { start: Date | null; end: Date | null } | null;

@Injectable({
  providedIn: 'root',
})
export class DateSelection {
  private singleDate: DateValue = null;
  private rangeDate: DateRangeValue = null;

  private singleDateSql: string | null = null;
  private rangeDateSql: { start: string | null; end: string | null } | null =
    null;

  // -------- Single Date ----------
  setDate(date: DateValue) {
    this.singleDate = date;
    this.singleDateSql = this.formatDateToMySQL(date);
  }

  getDate(): DateValue {
    return this.singleDate;
  }

  // retorna string YYYY-MM-DD ou null
  getDateSql(): string | null {
    return this.singleDateSql;
  }

  // -------- Range Date ----------
  setRange(range: DateRangeValue) {
    this.rangeDate = range;
    this.rangeDateSql = range
      ? {
          start: this.formatDateToMySQL(range.start),
          end: this.formatDateToMySQL(range.end),
        }
      : null;
  }

  getRange(): DateRangeValue {
    return this.rangeDate;
  }

  getRangeSql(): { start: string | null; end: string | null } | null {
    return this.rangeDateSql;
  }

  // -------- Save Date ----------
  saveDate(date: Date | Date[] | DateRangeValue) {
    if (Array.isArray(date)) {
      const [a, b] = date;
      this.setRange({ start: a ?? null, end: b ?? null });
      console.log('Service recebeu array. Range (JS):', this.rangeDate);
      console.log('Service salvou range (SQL YYYY-MM-DD):', this.rangeDateSql);
    } else if (
      date &&
      typeof date === 'object' &&
      'start' in date &&
      'end' in date
    ) {
      this.setRange(date as DateRangeValue);
      console.log('Service recebeu objeto range (JS):', this.rangeDate);
      console.log('Service salvou range (SQL YYYY-MM-DD):', this.rangeDateSql);
    } else {
      const d = (date as Date) ?? null;
      this.setDate(d);
      console.log('Service recebeu single date (JS):', this.singleDate);
      console.log(
        'Service salvou single date (SQL YYYY-MM-DD):',
        this.singleDateSql
      );
    }
  }
  // --- utilitário: formata Date para 'YYYY-MM-DD' ---
  private formatDateToMySQL(d: Date | null): string | null {
    if (!d) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0'); // meses 0-11
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
