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

  formatDateDisplay(
    date?: string | number | Date | null,
    showTime = false
  ): string {
    if (date === undefined || date === null || date === '') return '-';

    let d: Date | null = null;

    if (date instanceof Date) {
      d = date;
    } else if (typeof date === 'number') {
      // número pode ser segundos (ex: 163...) ou ms (ex: 1630000000000)
      // considerar números pequenos como segundos (<= 1e10)
      const ms = date < 1e11 ? date * 1000 : date;
      d = new Date(ms);
    } else if (typeof date === 'string') {
      const parsed = Date.parse(date);
      if (!isNaN(parsed)) {
        d = new Date(parsed);
      } else {
        // tentar DD/MM/YYYY -> converter para YYYY-MM-DD
        const dmY = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+.*)?$/;
        const m = date.trim().match(dmY);
        if (m) {
          const candidate = `${m[3]}-${m[2]}-${m[1]}`;
          const p2 = Date.parse(candidate);
          if (!isNaN(p2)) d = new Date(p2);
        }
      }
    }

    if (!d || isNaN(d.getTime())) return '-';

    if (showTime) {
      const datePart = d.toLocaleDateString('pt-BR');
      const timePart = d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${datePart} ${timePart}`;
    }

    return d.toLocaleDateString('pt-BR'); // 'dd/mm/yyyy'
  }
}
