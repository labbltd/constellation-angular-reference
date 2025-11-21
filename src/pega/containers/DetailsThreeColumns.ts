import { Component } from "@angular/core";
import { PContainerComponent } from "@labb/angular-adapter";

@Component({
    selector: 'dx-details-three-columns',
    template: `
        <div class="three-column">
            <div>
                @for (child of container.children[0].children; track child.id) {
                    <ng-container
                        dxContainer
                        [container]="child"
                    ></ng-container>
                }
            </div>
            <div>
                @for (child of container.children[1].children; track child.id) {
                    <ng-container
                        dxContainer
                        [container]="child"
                    ></ng-container>
                }
            </div>
            <div>
                @for (child of container.children[2].children; track child.id) {
                    <ng-container
                        dxContainer
                        [container]="child"
                    ></ng-container>
                }
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
    ],
    standalone: false
})
export class DetailsThreeColumnComponent extends PContainerComponent { }