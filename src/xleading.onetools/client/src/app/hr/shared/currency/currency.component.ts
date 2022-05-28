import { Component, Input, OnInit } from '@angular/core';
import { HrCurrencyEnum } from 'src/app/models/hr.model';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  @Input()
  value: number;

  @Input()
  currency: HrCurrencyEnum = HrCurrencyEnum.VND;

  @Input()
  symbol: string;

  constructor() { }

  ngOnInit(): void {
  }

}
