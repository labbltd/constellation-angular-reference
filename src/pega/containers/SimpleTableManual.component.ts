import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { SimpleTableManual } from '@labb/dx-engine';

@Component({
  selector: 'dx-simple-table-manual-container',
  template: `
    @if(container.config.label) {
      <label [for]="container.id">
      {{ container.config.label }}
      </label>
    }
    @if(container.readOnlyMode || container.allowEditingInModal) {
      <table>
        <thead>
          @for(col of container.processedFields; track col.config.name) {
            <th>{{col.config.label}}</th>
          }
        </thead>
        <tbody>
          @for(row of container.rowData; track row.id) {
            <tr>
              @for(col of container.processedFields; track col.config.name) {
                <td [innerHTML]="row[col.config.name] || '---'"></td>
              }
            </tr>
          }
        </tbody>
      </table>
    }
    @if(container.editableMode && !container.allowEditingInModal) {
      <table>
        <thead>
          @for(col of container.fieldDefs; track col.name) {
            @if(col.meta?.config?.hide !== true) {
              <th>{{col.label}}</th>
            }
          }
        </thead>
        <tbody>
          @for(row of container.elementsData; track $index) {
            <tr>
              @for(col of row; track $index) {
                <td>
                  <ng-container dxContainer [container]="col"/>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  standalone: false
})
export class SimpleTableManualComponent extends PContainerComponent<SimpleTableManual> {
}
