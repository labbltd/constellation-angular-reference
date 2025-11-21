import { Component } from '@angular/core';
import { PContainerComponent } from '@labb/angular-adapter';

@Component({
  selector: 'dx-default-container',
  template: `
    <label>
      Search
      <input type="text" (change)="search($event.target)" />
    </label>
    Create new case
    <ul>
      @for (caseType of container.config.caseTypes; track caseType.pyClassName) {
        <li (click)="createCase(caseType)">
          {{ caseType.pxPageViewIcon }} {{ caseType.pyLabel }}
        </li>
      }
    </ul>
    Navigate to page
    <ul>
      @for(page of container.config.pages; track page.pyLabel) {
        <li (click)="openPage(page)">
          {{ page.pxPageViewIcon }} {{ page.pyLabel }}
        </li>
      }
    </ul>
    @for(child of container.children; track child.id) {
      <ng-container
        dxContainer
        [container]="child"
      ></ng-container>
    }
  `,
  standalone: false
})
export class AppShellComponent extends PContainerComponent {
  public async search(target: any): Promise<void> {
    const searchValue = target.value;
    if ('' === searchValue) {
      return this.container.pconnect
        .getActionsApi()
        .showPage('pySearchPage', 'Data-Portal');
    }
    const cleanedSearchValue = searchValue.replace(/['"]+/g, '');
    const dataResponse = await window.PCore.getDataApiUtils().getData(
      'D_pySearch',
      JSON.stringify({
        dataViewParameters: {
          SearchString: encodeURIComponent(cleanedSearchValue),
        },
      })
    );
    if (
      null === dataResponse.data.data ||
      1 !== dataResponse.data.resultCount ||
      dataResponse.data.data[0].pyID.toUpperCase() !==
      cleanedSearchValue.toUpperCase()
    ) {
      this.container.pconnect
        .getActionsApi()
        .showPage('pySearchPage', 'Data-Portal');
    } else {
      this.container.pconnect
        .getActionsApi()
        .openWorkByHandle(
          dataResponse.data.data[0].pzInsKey,
          dataResponse.data.data[0].pzCategoryActionKeys
        );
    }
  }

  public async createCase(caseType: {
    pyClassName: string;
    pyFlowType: string;
  }): Promise<void> {
    await this.container.pconnect
      .getActionsApi()
      .createWork(caseType.pyClassName, {
        containerName: 'primary',
        flowType: caseType.pyFlowType || 'pyStartCase',
      });
  }

  public async openPage(page: {
    pyRuleName: string;
    pyClassName: string;
  }): Promise<void> {
    await this.container.pconnect
      .getActionsApi()
      .showPage(page.pyRuleName, page.pyClassName);
  }
}
