import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { Attachment, FileStatus } from '@labb/dx-engine';

@Component({
  selector: 'dx-attachment-control',
  template: `
    <div>
    <label [for]="container.id">{{ container.config.label }}{{ container.config.required ? ' *' : '' }}</label>
    @if (allowMultiple || !container.files.length) {
      <input #fileInput type="file"
        [id]="container.id"
        [attr.accept]="container.config.extensions || null"
        [attr.aria-required]="container.config.required || null"
        [attr.aria-invalid]="container.config.validatemessage ? 'true' : null"
        [attr.aria-describedby]="container.id + '-info'"
        (change)="upload($event)"
        [multiple]="allowMultiple"
      />
    }
    @if (container.config.validatemessage) {
      <small role="alert" [id]="container.id + '-info'">{{ container.config.validatemessage }}</small>
    } @else if (container.config.helperText || container.config.extensions) {
      <small [id]="container.id + '-info'">
        {{ container.config.helperText }}
        @if (container.config.extensions) { Allowed file types: {{ container.config.extensions }} }
      </small>
    }
    @if (container.files.length) {
      <figure>
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
              <td>{{file.size != null ? container.formatBytes(file.size!) : '--'}}</td>
              <td>{{file.type}}</td>
              <td><progress max="100" [value]="file.progress">{{file.progress}}%</progress></td>
              <td>
                @if (file.type.startsWith('image')) { <button type="button" (click)="preview(file)">Preview</button> }
                <button type="button" [attr.aria-label]="'Delete ' + file.name" (click)="remove(file)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
      </figure>
    }
    </div>
    <dialog #dialogRef aria-label="Preview">
      <img [src]="downloadedImage" alt="Preview" />
      <menu>
        <li><button type="button" (click)="dialog.nativeElement.close()">Close</button></li>
      </menu>
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
