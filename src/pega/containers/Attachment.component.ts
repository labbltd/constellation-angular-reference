import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { Attachment, FileStatus } from '@labb/dx-engine';

@Component({
  selector: 'dx-attachment-control',
  template: `
    <label>
      {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
      <input #fileInput type="file" 
        (change)="upload($event)" 
        [multiple]="allowMultiple"
        *ngIf="allowMultiple || !container.files.length"
      />
      {{ container.config.helperText }}
      {{ container.config.validatemessage }}
      {{ container.config.extensions }}
    </label>
    <table *ngIf="container.files?.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Type</th>
          <th>Uploaded</th>
          <th>Error</th>
          <th>Error Status</th>
          <th>Progress</th>
          <th>ID</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let file of container.files">
          <td>{{file.name}}</td>
          <td>{{file.size}}</td>
          <td>{{file.type}}</td>
          <td>{{file.uploaded}}</td>
          <td>{{file.error}}</td>
          <td>{{file.errorStatus}}</td>
          <td>{{file.progress}}</td>
          <td>{{file.id}}</td>
          <td>
            <button type="button" (click)="remove(file)">delete</button>
            <button *ngIf="file.linked" (click)="download(file)">download</button>
          </td>
        </tr>
      </tbody>
    </table>
    <img *ngIf="downloadedImage" width="100%" [src]="'data:image/png;base64,' + downloadedImage" />
  `,
})
export class AttachmentComponent extends PContainerComponent<Attachment> {
  public downloadedImage?: string;

  public get allowMultiple(): boolean {
    return this.container.config.allowMultiple === 'true';
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
