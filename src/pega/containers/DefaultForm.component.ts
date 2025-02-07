import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PContainerComponent } from '@typescale/angular-adapter';

@Component({
  selector: 'dx-default-form-template',
  template: `
    <div *ngIf="container.config.instructions && container.config.instructions !== 'none'" [innerHtml]="container.config.instructions"></div>
    <div [ngClass]="divClass">
      <ng-template
        *ngFor="let child of container.children"
        dxContainer
        [container]="child"
      ></ng-template>
    </div>
  `,
  styles: [
    `
      .one-column {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: calc(1rem);
      }
    `,
    `
      .two-column {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: calc(1rem);
      }
    `,
    `
      .three-column {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: calc(1rem);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None
})
export class DefaultFormComponent
  extends PContainerComponent
  implements OnInit {
  public divClass = 'one-column';

  public ngOnInit(): void {
    switch (this.container.config.NumCols ? this.container.config.NumCols : '1') {
      case '1':
        this.divClass = 'one-column';
        break;
      case '2':
        this.divClass = 'two-column';
        break;
      case '3':
        this.divClass = 'three-column';
        break;
      default:
        this.divClass = 'one-column';
        break;
    }
    if (this.container.children.length <= 2) {
      this.divClass = 'one-column';
    }
  }
}
