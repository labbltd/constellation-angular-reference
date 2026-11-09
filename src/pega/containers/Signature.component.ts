import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'dx-signature-capture',
  template: `
    @if (container.config.readOnly) {
      <dl>
        <dt>{{container.config.label}}</dt>
        <dd>
          @if (container.config.value) { <img [src]="container.config.value" [alt]="container.config.label"> } @else { -- }
        </dd>
      </dl>
    }
    @if (!container.config.readOnly) {
      <fieldset>
        <legend>{{container.config.label}}{{ container.config.required ? ' *' : '' }}</legend>
        <canvas #canvas role="img" [attr.aria-label]="'Signature pad for ' + container.config.label"></canvas>
        <menu>
          <li><button type="button" (click)="onClear()">Clear</button></li>
          <li><button type="button" (click)="onAccept()" [disabled]="!hasValueChanged">Accept</button></li>
        </menu>
        <output>{{info}}</output>
      </fieldset>
    }
  `,
  standalone: false
})
export class SignatureComponent extends PContainerComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  public signature!: SignaturePad;
  public hasValueChanged = false;
  public info = '';

  public ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    this.signature = new SignaturePad(canvas, {
      penColor: '#056dae'
    });
    this.signature.addEventListener('endStroke', () => {
      this.onEndStroke();
    });
    this.resizeCanvas();
    this.signature.on();
  }

  public onClear() {
    this.signature.clear();
    this.hasValueChanged = false;
    this.info = '';
  }

  public onAccept() {
    const newValue = this.canvas.nativeElement.toDataURL('image/svg+xml');
    if (newValue) {
      this.container.updateFieldValue(newValue);
      this.hasValueChanged = false;
      this.info = 'Signature captured';
    }
  }

  private resizeCanvas() {
    const canvas = this.canvas.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
  }

  private onEndStroke() {
    this.hasValueChanged = true;
  }
}
