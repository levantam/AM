import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { HrGrossNetConfiguationName } from 'src/app/constants/general.constant';
import { HrGrossNetConfiguation, HrGrossNetModel } from 'src/app/models/hr.model';
import { DefaultHrGrossNetModel, ParseHrGrossNetConfiguation } from 'src/app/utils/general.util';

@Component({
  selector: 'app-gross-net-conversion',
  templateUrl: './gross-net-conversion.component.html',
  styleUrls: ['./gross-net-conversion.component.scss']
})
export class GrossNetConversionComponent implements OnInit {

  currentTab = '';
  configuration: HrGrossNetConfiguation | undefined;
  salaryInformation: HrGrossNetModel;
  constructor(firestore: AngularFirestore) { 
    this.salaryInformation = DefaultHrGrossNetModel();
    firestore.collection(HrGrossNetConfiguationName).valueChanges().subscribe(config => {
      this.configuration = ParseHrGrossNetConfiguation(config[0]);
    });
  }

  ngOnInit(): void {
  }
  onChangeTab(tab: string) {
    this.currentTab = tab;
  }
  convert(convertType: string) {

  }
}
