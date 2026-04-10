import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  input,
} from '@angular/core';

export interface DataTableColumn<T extends object> {
  key: keyof T & string;
  label: string;
  width?: string;
  /** Optional formatter when cell is not a plain property. */
  format?: (row: T) => string;
}

@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T extends object> {
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly rows = input.required<T[]>();
  readonly trackByKey = input<keyof T & string>('id' as keyof T & string);
  readonly emptyMessage = input('No rows to display.');

  readonly actionsTemplate = contentChild<TemplateRef<{ $implicit: T }>>('actions');

  protected cellValue(row: T, col: DataTableColumn<T>): string {
    if (col.format) {
      return col.format(row);
    }
    const v = row[col.key];
    if (v === null || v === undefined) {
      return '—';
    }
    return String(v);
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected trackByRow(index: number, row: T): string {
    const key = this.trackByKey();
    const v = (row as Record<string, unknown>)[key];
    return v !== undefined && v !== null ? String(v) : String(index);
  }
}
