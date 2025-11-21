import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'dx-signature-capture',
  template: `
    <label [for]="container.id">{{container.config.label}}</label>
    @if (container.config.readOnly) {
      <img [src]="container.config.value">
    }
    @if (!container.config.readOnly) {
      <canvas style="width: 100%; height: 200px; border: 1px dashed" #canvas></canvas>
      <button type="button" (click)="onClear()">
        Clear
      </button>
      <button type="button" (click)="onAccept()"
        [disabled]="!hasValueChanged">
        Accept
      </button>
      @if(info) {
        <div>{{info}}</div>
      }
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
