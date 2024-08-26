import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { Table } from 'primeng/table'

import * as FileSaver from 'file-saver';

import { SampleService } from '../../../../shared/services/sample.service';
import { AnnotationService } from '../../../../shared/services/annotation.service';
import { Sample } from '../../../../shared/models/sample.model';
import { Annotation } from '../../../../shared/models/annotation.model';

@Component({
  selector: 'sample-data-view',
  templateUrl: './sample-data-view.component.html',
  styleUrls: ['./sample-data-view.component.scss'],
})
export class SampleDataViewComponent {
  @Input() samples: Sample[] = [];
  @Input() sampleAnnotations: Annotation[] = []; 
  @Input() sampleAnnotationNames: string[] = [];
  @Input() pointsSelected: Sample[] = [];
  @Output() onSampleDataFilterChartEvent = new EventEmitter<any[]>();

  @ViewChild('sampleDataTable')
  sampleDataTable: Table | undefined;
  
  // aplication definitions
  readonly LANGUAGE_ID = "us"; // English: us; Spanish: es
  
  isLoading: boolean = false;
  pointsFiltered: any = [];
  filterGlobal = null;

  constructor(private sampleService: SampleService, private annotationService: AnnotationService) {    
  }  

  ngOnChanges() {
    // get all samples as selected by default if not samples all selected
    if (this.pointsSelected.length == 0) {
      this.pointsSelected = this.samples;
    }
  }
  
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
    });

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  
  onClearFilterGlobal() {
    this.sampleDataTable!.clear();
    this.filterGlobal = null;
  }

  onSampleFiltered(event) {
    this.pointsFiltered = event.filteredValue;
  }
    
  onFilterChart(event) {
      // clear any table filter 
      this.onClearFilterGlobal();

      // recover chart index to be selected
      let pointsChart = [];
      for (let i = 0; i < this.pointsFiltered.length; i++) {
        const pointChart = this.samples.findIndex((sample) => sample.sample_id == this.pointsFiltered[i].sample_id);

        if (pointChart != -1)
          pointsChart.push(pointChart);
      }
          
      this.onSampleDataFilterChartEvent.emit(pointsChart);
  }  

  
  onApplyFilterGlobal($event: any, stringVal: any) {
    this.sampleDataTable!.filterGlobal($event.value, stringVal);
  }
  
  onExportSamples($event: any) {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.pointsSelected);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        this.saveAsExcelFile(excelBuffer, 'samples_data');
    });
  }  
}
