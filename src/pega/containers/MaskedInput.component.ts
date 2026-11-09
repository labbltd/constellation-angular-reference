import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PContainerComponent } from '@labb/angular-adapter';
import IMask from 'imask';

@Component({
  selector: 'dx-masked-input-control',
  template: `
  @if (container.config.readOnly) {
    <dl><dt>{{ container.config.label }}</dt><dd>{{container.config.value ?? '--'}}</dd></dl>
  }
  @if (!container.config.readOnly) {
    <div>
      <label [for]="container.id">{{ container.config.label }}{{ container.config.required ? ' *' : '' }} <small>({{ container.config.mask }})</small></label>
      <input
        #input
        [id]="container.id"
        type="text"
        [attr.aria-required]="container.config.required || null"
        [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
        [attr.aria-describedby]="container.config.validatemessage || container.config.helperText ? container.id + '-info' : null"
        [attr.placeholder]="container.config.placeholder"
        [value]="container.config.value"
        (change)="container.updateFieldValue($event.target.value)"
        (blur)="container.triggerFieldChange($event.target.value)"
      />
      @if (container.config.validatemessage) {
        <small role="alert" [id]="container.id + '-info'">{{ container.config.validatemessage }}</small>
      } @else if (container.config.helperText) {
        <small [id]="container.id + '-info'">{{ container.config.helperText }}</small>
      }
    </div>
  }
  `,
  standalone: false
})
export class MaskedInputComponent extends PContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input!: ElementRef;
  public control = new FormControl('');

  public ngAfterViewInit(): void {
    const maskOptions = {
      mask: this.container.config.mask,
      definitions: {
        // defaults are '0', 'a', '*'
        // You can extend by adding other characters
        A: /[A-Z]/
      }
    }
    IMask(this.input.nativeElement, maskOptions);
  }
}
