import { Component } from "@angular/core";
import { PContainerComponent } from "@typescale/angular-adapter";

@Component({
    selector: 'dx-details-three-columns',
    template: `
        <div class="three-column">
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
            <div>
                <ng-template
                    *ngFor="let child of container.children[2].children"
                    dxContainer
                    [container]="child"
                ></ng-template>
            </div>
        </div>
    `,
    styles: [
        `
        .three-column {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: calc(1rem);
        }
        `
    ]
})
export class DetailsThreeColumnComponent extends PContainerComponent { }