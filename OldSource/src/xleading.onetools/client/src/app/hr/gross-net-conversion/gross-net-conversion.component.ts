import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { HrGrossNetConfiguationName } from 'src/app/constants/general.constant';
import { CostByRegion, HrCurrencyEnum, HrGrossNetConfiguation, HrGrossNetModel, SalaryInformation} from 'src/app/models/hr.model';
import { Currency } from 'src/app/utils/enums/currency-enum';
import { calCulateTheSalary, DefaultHrGrossNetModel, isVietnamdong, ParseHrGrossNetConfiguation } from 'src/app/utils/general.util';
import { GetCostByRegion } from '../configurations/general-configurations';

@Component({
  selector: 'app-gross-net-conversion',
  templateUrl: './gross-net-conversion.component.html',
  styleUrls: ['./gross-net-conversion.component.scss']
})
export class GrossNetConversionComponent implements OnInit {
  currencyOptions = { prefix: '', prefixStr: Currency.VND, thousands: '.', decimal: ',', precision: 0 };
  detailStr = 'Vùng 1 | 0 Người Phụ Thuộc | Đóng BH trên lương chính thức'
  currentTab = '';
  configuration: HrGrossNetConfiguation | undefined;
  regionConfigurations: CostByRegion[] = [];
  maximumDependenciesCount = 8;
  maximumSalary = 300000000;// 300M
  maximumDependencies: number[] = [];
  currency = HrCurrencyEnum;// for UI
  currentDate = new Date();

  // Enhance
  suggestSalaries: number[] = [];

  // Chart
  chart: any[];
  view: [number, number] = [300, 160];
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  }
  
  // UI
  showDetail =false;
  showResult = false;
  isReady = false;
  // END UI

  input: HrGrossNetModel;
  calculatedSalary: SalaryInformation;
  isOpeningDetail = false;
  constructor(private firestore: AngularFirestore, private modalService: NgbModal) { 
    this.input = DefaultHrGrossNetModel();
    this.getConfigurations();
    this.regionConfigurations = GetCostByRegion();
    this.maximumDependencies = Array(this.maximumDependenciesCount).fill(1).map((x,i)=>i);
  }

  ngOnInit(): void {
  }
  onChangeTab(tab: string) {
    this.currentTab = tab;
  }
  convert(convertType: string) {

  }
  suggestSalary() {
    this.suggestSalaries = [];
    if (this.input.salary < 10000000) {
      const multip = [10, 100, 1000, 10000, 100000];
      multip.forEach(element => {
        this.suggestSalaries.push(this.input.salary * element);
      });
    }
    
  }
  chooseSalary(salary: number) {
    this.input.salary = salary;
    this.onSubmit(this.input.isGrossSalary);
    this.suggestSalaries = [];
  }
  onChangeSalary() {
    // this.input.isVietnamdongSalary = isVietnamdong(this.input.salary);
    if (this.isReady) {
      this.onSubmit(this.input.isGrossSalary);
    }
  }
  onOpenDetail() {
    this.isOpeningDetail = !this.isOpeningDetail;
  }
  onChangeDepenencyCount(count: number) {
    this.input.dependantCount = count;
  }
  onChangeRegion(region: CostByRegion) {
    this.input.region = region.region;
  }
  onChangeInsuranceWageType(isFullSalaryWage: boolean) {
    this.input.isFullInsuranceWage = isFullSalaryWage;
  }
  onChangeSalaryWage() {

  }
  onChangeCurrencyType(isVietnamdong: boolean) {
    this.input.isVietnamdongSalary = isVietnamdong;
    this.currencyOptions.prefixStr = this.input.isVietnamdongSalary ? Currency.VND : Currency.DOLLAR;
  }
  onSubmit(isGross: boolean) {
    this.isReady = this.validate();
    if (this.isReady) {
      this.input.isGrossSalary = isGross;
      this.calculatedSalary = calCulateTheSalary(this.input, this.configuration as any);
      this.showResult = true;
      this.buildChart();
      this.buildDetailString();
    }
  }
  validate(): boolean {
    let isValid = true;
    if (this.input.salary == 0) {
      isValid = false;
    }
    return isValid;
  }
  openModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // close
    }, (reason) => {
      // dimiss
    });
  }
  resetConfiguration() {
    this.getConfigurations();
  }
  getConfigurations() {
    this.firestore.collection(HrGrossNetConfiguationName).valueChanges().subscribe(config => {
      this.configuration = ParseHrGrossNetConfiguation(config[0]);
      this.isReady = true;
    });
  }
  buildChart() {
    this.chart = [
      {
        "name": "Bảo hiểm",
        "value": this.calculatedSalary.totalInsurance
      },
      {
        "name": "Thuế",
        "value": this.calculatedSalary.tax
      },
      {
        "name": "Lương NET",
        "value": this.calculatedSalary.netVietnamdong
      }
    ]
  }
  buildDetailString() {
    this.detailStr = `Vùng ${this.input.region} | ${this.input.dependantCount} Người Phụ Thuộc`;
    this.detailStr += this.input.isFullInsuranceWage ? ' | Đóng BH trên lương chính thức' : ' | Đóng BH trên lương cố định';
  }
}
