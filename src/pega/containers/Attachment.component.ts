import { Component } from '@angular/core';
import { PContainerComponent } from '@typescale/angular-adapter';
import { Attachment } from '@typescale/dx-engine';

@Component({
  selector: 'dx-attachment-control',
  template: `
    <label>
      {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
      <input type="file" (change)="uploadFile($event)" />
      {{ container.config.helperText }}
    </label>
  `,
})
export class AttachmentComponent extends PContainerComponent<Attachment> {
  public progress!: ProgressEvent<EventTarget>;
  public error!: boolean | File;

  public async uploadFile(e: Event): Promise<void> {
    await this.container.uploadFile(e);
  }
}
