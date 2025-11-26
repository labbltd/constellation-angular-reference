import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PContainerComponent } from "@labb/angular-adapter";
import { Location } from "@labb/dx-engine";

@Component({
    selector: 'dx-location',
    template: `
         @if (container.config.readOnly) {
            <dt>{{ container.config.label }}</dt><dd>{{container.config.value ?? '--'}}</dd>
        } @else {
            <label [for]="container.id">
            {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
            @if (container.config.helperText) {
                <span [attr.data-tooltip]="container.config.helperText">?</span>
            }
            </label>
            @if (container.config.validatemessage) {
                <em>{{ container.config.validatemessage }}</em>
            }
            <input type="text" [formControl]="searchControl" 
                (change)="updateSearch($event)"
                [id]="container.id">
        
            @if(suggestions.length > 0) {
                <select [formControl]="selectControl" (change)="select($event)">
                    <option value selected>Select {{container.config.label}}...</option>
                    @for(suggestion of suggestions; track suggestion) {
                        <option [value]="suggestion">{{suggestion}}</option>
                    }
                </select>
            }
            <div #map [attr.style]="'height: 25rem; margin-bottom: 1.5rem; display: ' + (container.config.value ? 'block' : 'none')"></div>
        }
    `,
    standalone: false
})
export class LocationComponent extends PContainerComponent<Location> implements AfterViewInit {
    @ViewChild('map') map!: ElementRef;
    public searchControl = new FormControl('');
    public selectControl = new FormControl('');
    public suggestions: string[] = [];

    public async ngAfterViewInit(): Promise<void> {
        if (this.container.config.readOnly) {
            return;
        }
        await this.container.loadMap(this.map.nativeElement);
        if (this.container.config.value && !this.searchControl.value) {
            await this.prefill();
        }
        this.container.updates.subscribe(() => {
            if (this.container.config.value) {
                this.prefill();
            }
        });
    }

    private async prefill() {
        const event = { target: { value: this.container.config.value } } as any;
        this.searchControl.setValue(this.container.config.value);
        await this.updateSearch(event);
        this.selectControl.setValue(this.container.config.value);
        await this.select(event);
        await this.container.putMarker(this.container.config.value);
    }

    public async updateSearch(event: Event) {
        const value = (event.target as HTMLInputElement)?.value;
        await this.container.updateFieldValue(value);
        await this.container.triggerFieldChange(value);
        this.suggestions = await this.container.getPlacePredictions(value);
    }

    public async select(event: Event) {
        await this.container.setLocation((event?.target as any).value);
    }
}