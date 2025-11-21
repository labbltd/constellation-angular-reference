import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';
import { Attachment, FileStatus } from '@labb/dx-engine';

@Component({
  selector: 'dx-attachment-control',
  template: `
    <label>
      {{ container.config.label }}{{ container.config.required ? ' *' : '' }}
      @if (allowMultiple || !container.files.length){
        <input #fileInput type="file" 
          (change)="upload($event)" 
          [multiple]="allowMultiple"
        />
      }
      {{ container.config.helperText }}
      {{ container.config.validatemessage }}
      {{ container.config.extensions }}
    </label>
    @if(container.files.length) {
      <table>
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
          @for(file of container.files; track file.id) {
            <tr>
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
                @if (file.linked) {
                  <button (click)="download(file)">download</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
    @if(downloadedImage) {
      <img width="100%" [src]="'data:image/png;base64,' + downloadedImage" />
    }
  `,
  standalone: false
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
