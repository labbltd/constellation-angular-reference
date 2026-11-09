import { Component } from "@angular/core";
import { PContainerComponent } from "@labb/angular-adapter";

@Component({
    selector: 'dx-details-two-columns',
    template: `
        <div data-columns="2">
            <div data-columns="1">
                @for (child of container.children[0].children; track child.id) {
                    <ng-container dxContainer [container]="child"/>
                }
            </div>
            <div data-columns="1">
                @for (child of container.children[1].children; track child.id) {
                    <ng-container dxContainer [container]="child"/>
                }
            </div>
        </div>
    `,
    standalone: false
})
export class DetailsTwoColumnComponent extends PContainerComponent { }