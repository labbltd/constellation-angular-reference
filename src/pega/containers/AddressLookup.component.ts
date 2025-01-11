import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PContainerComponent } from "@typescale/angular-adapter";
import { take } from "rxjs";

interface Address {
    OrganisationName: string;
    BuildingNumber: number;
    AddressLine: string;
    Postcode: string;
    Town: string;
    pyGUID: string;
}

@Component({
    selector: 'dx-address-lookup',
    template: `<label *ngIf="!searchResults && !address"> Zipcode
    <input type="text" [formControl]="control">
  </label>
  <table *ngIf="searchResults">
    <thead>
      <tr>
        <th *ngFor="let h of model.header">{{h}}</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let row of model.data; index as i" (click)="selectAddress(i)">
        <td *ngFor="let col of row">{{col}}</td>
      </tr>
    </tbody>
  
  <div *ngIf="address">
    {{address.OrganisationName}} {{address.BuildingNumber}} {{address.AddressLine}} {{address.Postcode}} {{address.Town}}
  </div>`
})
export class AddressLookupComponent extends PContainerComponent implements OnInit {
    public control = new FormControl('', { updateOn: 'blur' });
    public searchResults: Address[] | null = null;
    public address: Address | null = null;

    public model = {
      header : [] as string [],
      data : [] as (number | string) [][],
    };


    public ngOnInit(): void {
        this.control.valueChanges.pipe(take(1)).subscribe(async () => {
            this.searchResults = (await window.PCore.getDataApiUtils().getData<Address>('D_AddressesList', {})).data.data;
            if (this.searchResults) {
                const data = ['OrganisationName', 'BuildingNumber', 'AddressLine', 'Postcode', 'Town'];
                this.model.header = data;
                this.model.data = this.searchResults.map(item => [
                    item.OrganisationName,
                    item.BuildingNumber,
                    item.AddressLine,
                    item.Postcode,
                    item.Town
                ]);
            }
        })
    }

    public selectAddress(index: number): void {
        if (this.searchResults) {
            this.address = this.searchResults[index];
            this.searchResults = null;
            this.container.updateFieldValue(this.address.pyGUID);
        }
    }
}
