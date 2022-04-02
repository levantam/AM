import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrossNetConversionComponent } from './gross-net-conversion/gross-net-conversion.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';

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
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HrModule { }
