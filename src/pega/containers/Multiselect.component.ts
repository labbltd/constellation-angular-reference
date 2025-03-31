import { Component } from "@angular/core";
import { PContainerComponent } from "@labb/angular-adapter";
import { Multiselect } from "@labb/dx-engine";

@Component({
    selector: 'dx-multi-select',
    template: `
        <label>
            {{container.config.label}}
            <input type="text" (blur)="container.onSearchHandler($event)">
        </label>
        <label *ngFor="let item of container.itemsTree"><input type="checkbox" [checked]="item.selected" (change)="container.toggleItem(item.id!)">{{item.primary}}</label>
    `
})
export class MultiselectComponent extends PContainerComponent<Multiselect> {
}