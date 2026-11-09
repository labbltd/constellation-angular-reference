import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { BootstrapService } from '@labb/dx-engine';

@Component({
  selector: 'dx-case-summary',
  template: `
    <p><a href="#" (click)="$event.preventDefault(); backToWorklist()">&larr; Back to worklist</a></p>
    <details (toggle)="showSummary = $any($event.target).open">
      <summary>Case details</summary>
      @if (showSummary) {
        @for (child of container.children; track child.id) {
          <ng-container dxContainer [container]="child"/>
        }
      }
    </details>
  `,
  standalone: false
})
export class CaseSummaryComponent extends PContainerComponent {
  showSummary = false;

  public async backToWorklist() {
    await BootstrapService.openPage('pyWorklist', 'Data-Portal', 'app');
  }
}
