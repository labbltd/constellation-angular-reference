import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PContainerComponent } from "@labb/angular-adapter";
import { Location } from "@labb/dx-engine";

@Component({
    selector: 'dx-location',
    template: `
         @if (container.config.readOnly) {
            <dl><dt>{{ container.config.label }}</dt><dd>{{container.config.value ?? '--'}}</dd></dl>
        } @else {
            <div>
            <label [for]="container.id">{{ container.config.label }}{{ container.config.required ? ' *' : '' }}</label>
            <input type="text" [formControl]="searchControl"
                (change)="updateSearch($event)"
                [id]="container.id"
                [attr.aria-required]="container.config.required || null"
        [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
        [attr.aria-describedby]="container.config.validatemessage || container.config.helperText ? container.id + '-info' : null">
            @if(suggestions.length > 0) {
                <select [formControl]="selectControl" (change)="select($event)"
                    [attr.aria-label]="'Select ' + container.config.label">
                    <option value selected>Select {{container.config.label}}...</option>
                    @for(suggestion of suggestions; track suggestion) {
                        <option [value]="suggestion">{{suggestion}}</option>
                    }
                </select>
            }
            @if (container.config.validatemessage) {
        <small role="alert" [id]="container.id + '-info'">{{ container.config.validatemessage }}</small>
      } @else if (container.config.helperText) {
        <small [id]="container.id + '-info'">{{ container.config.helperText }}</small>
      }
            <!-- The map library needs an element with an explicit height. -->
            <div #map style="height: 25rem; margin-top: 0.75rem" [hidden]="!container.config.value"></div>
            </div>
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