import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { Attachment, FileStatus } from '@labb/dx-engine';

@Component({
  selector: 'dx-attachment-control',
  template: `
    <label>
      {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
      @if (allowMultiple || !container.files.length) {
        <input #fileInput type="file" 
          (change)="upload($event)" 
          [multiple]="allowMultiple"
        />
      }
      {{ container.config.helperText }}
      {{ container.config.validatemessage }}
      {{ container.config.extensions }}
    </label>
    @if (container.files.length) {
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Type</th>
            <th>Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          @for (file of container.files; track file.id) {
            <tr>
              <td>{{file.name}}</td>
              <td>{{container.formatBytes(file.size!)}}</td>
              <td>{{file.type}}</td>
              <td>{{file.progress}}</td>
              <td>
                <button type="button" (click)="remove(file)">Delete</button>
                @if (file.type.startsWith('image')) { <button type="button" (click)="preview(file)">Preview</button> }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
    <dialog #dialogRef>
      <button type="button" (click)="dialog.nativeElement.close()">Close</button>
      <img width="100%" [src]="downloadedImage" />
    </dialog>
  `,
  standalone: false
})
export class AttachmentComponent extends PContainerComponent<Attachment> {
  @ViewChild('dialogRef') dialog!: ElementRef<HTMLDialogElement>;
  public downloadedImage?: string;

  public get allowMultiple(): boolean {
    return this.container.config.allowMultiple === 'true';
  }

  public async preview(file: FileStatus) {
    if (file.linked) {
      this.downloadedImage = 'data:image/png;base64,' + await this.container.downloadFile(file.id);
    } else {
      this.downloadedImage = file.src;
    }
    this.dialog.nativeElement.showModal();
  }

  public async upload(e: Event): Promise<void> {
    await this.container.uploadFile(e);
  }

  public async remove(file: FileStatus): Promise<void> {
    await this.container.removeFile(file.id);
  }

  public async download(file: FileStatus): Promise<void> {
    this.downloadedImage = await this.container.downloadFile(file.id);
  }
}
