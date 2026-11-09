import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { SimpleTableManual } from '@labb/dx-engine';

/**
 * Pega passes `required` and `validatemessage` through to SimpleTableManual, but they are
 * not (yet) declared on `SimpleTableManualProps`.
 */
type SimpleTableManualValidationProps = { required?: boolean; validatemessage?: string };

/**
 * HTML-only mapping of Pega's SimpleTableManual template
 * (cosmos-dxcomponents-library/src/components/Templates/SimpleTable/SimpleTableManual.jsx).
 *
 * All rows - editable, read-only and edit-in-modal - are rendered from `container.elementsData`,
 * a row/column grid of live cell containers. dx-engine already forces the cells to display-only
 * for read-only and edit-in-modal tables, so the template does not need to distinguish them.
 */
@Component({
  selector: 'dx-simple-table-manual-container',
  template: `
    <figure>
    <table [id]="container.id" [attr.aria-describedby]="validateMessage ? container.id + '-error' : null">
      @if (container.label) {
        <caption>{{ container.label }}{{ required ? ' *' : '' }}</caption>
      }
      <thead>
        <tr>
          @for (col of container.fieldDefs; track col.id) {
            <th scope="col">{{ col.label }}</th>
          }
          @if (container.showDeleteRowButton) {
            <th scope="col">Actions</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of container.elementsData; track $index; let rowIndex = $index) {
          <tr>
            @for (cell of row; track $index) {
              <td>
                <ng-container dxContainer [container]="cell"/>
              </td>
            }
            @if (container.showDeleteRowButton) {
              <td>
                <button type="button"
                  [attr.aria-label]="'Delete row ' + (rowIndex + 1)"
                  (click)="container.deleteRecord(rowIndex)">Delete</button>
              </td>
            }
          </tr>
        } @empty {
          <tr>
            <td [attr.colspan]="container.fieldDefs.length || 1">No records</td>
          </tr>
        }
      </tbody>
    </table>
    @if (validateMessage) {
      <small role="alert" [id]="container.id + '-error'">{{ validateMessage }}</small>
    }
    @if (container.showAddRowButton) {
      <menu>
        <li>
          <button type="button"
            [attr.aria-label]="container.targetClassLabel ? addLabel : 'Add a new record'"
            (click)="container.addRow()">+ {{ addLabel }}</button>
        </li>
      </menu>
    }
    </figure>
  `,
  standalone: false
})
export class SimpleTableManualComponent extends PContainerComponent<SimpleTableManual> {
  /** Required and validation messages only apply to tables the user can edit. */
  private get isEditable(): boolean {
    return !this.container.readOnlyMode && this.container.config.displayMode !== 'DISPLAY_ONLY';
  }

  get required(): boolean {
    return this.isEditable && !!(this.container.config as SimpleTableManualValidationProps).required;
  }

  get validateMessage(): string {
    return this.isEditable ? (this.container.config as SimpleTableManualValidationProps).validatemessage || '' : '';
  }

  get addLabel(): string {
    return this.container.targetClassLabel ? `Add ${this.container.targetClassLabel}` : 'Add';
  }
}
