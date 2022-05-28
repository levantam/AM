import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrossNetConversionComponent } from './gross-net-conversion/gross-net-conversion.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxCurrencyModule } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { CurrencyComponent } from './shared/currency/currency.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  { path: '',
    component: HomeComponent,
    children: [
      {path: 'gross-net-conversion', component: GrossNetConversionComponent}
    ]
  }
];

@NgModule({
  declarations: [
    GrossNetConversionComponent,
    HomeComponent,
    CurrencyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    NgxCurrencyModule,
    NgxChartsModule,
    FormsModule
  ]
})
export class HrModule { }
