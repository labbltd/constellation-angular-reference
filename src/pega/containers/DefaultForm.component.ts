import { Component, OnInit } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-default-form-template',
  template: `
    <div [attr.data-columns]="columns">
      @for (child of container.children; track child.id) {
        <ng-container dxContainer [container]="child"/>
      }
    </div>
  `,
  standalone: false
})
export class DefaultFormComponent
  extends PContainerComponent
  implements OnInit {
  /** Number of field columns: Pega's NumCols, or one column when the region has two fields or fewer. */
  public columns = '1';

  public override ngOnInit(): void {
    super.ngOnInit();
    const numCols = this.container.config.NumCols ?? '1';
    this.columns = ['1', '2', '3'].includes(numCols) ? numCols : '1';
    if (this.container.children[0]?.children.length <= 2) {
      this.columns = '1';
    }
  }
}
