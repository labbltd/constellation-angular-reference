import { Component } from "@angular/core";
import { PContainerComponent } from "@labb/angular-adapter";

@Component({
    selector: 'dx-details-two-columns',
    template: `
        <div class="two-column">
            <div>
                <ng-template
                    *ngFor="let child of container.children[0].children"
                    dxContainer
                    [container]="child"
                ></ng-template>
            </div>
            <div>
                <ng-template
                    *ngFor="let child of container.children[1].children"
                    dxContainer
                    [container]="child"
                ></ng-template>
            </div>
        </div>
    `,
    styles: [
        `
        .two-column {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: calc(1rem);
        }
        `
    ],
    standalone: false
})
export class DetailsTwoColumnComponent extends PContainerComponent { }