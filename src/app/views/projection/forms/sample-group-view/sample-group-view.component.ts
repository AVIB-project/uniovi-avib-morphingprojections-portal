import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { Table } from 'primeng/table'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import * as FileSaver from 'file-saver';

import { SampleGroupFormViewComponent } from './sample-group-form-view/sample-group-form-view.component';

import { Sample } from '../../../../shared/models/sample.model';
import { Annotation } from '../../../../shared/models/annotation.model';
import { SampleGroup } from '../../../../shared/models/sample-group.model';

@Component({
  selector: 'sample-group-view',
  templateUrl: './sample-group-view.component.html',
  styleUrls: ['./sample-group-view.component.scss'],
  providers: [DialogService]
})
export class SampleGroupViewComponent {
  @Input() samples: Sample[] = [];
  @Input() sampleAnnotations: Annotation[] = []; 
  @Input() sampleAnnotationNames: string[] = [];
  @Input() sampleGroups: SampleGroup[] = [];
  @Output() onSampleGroupFilterChartEvent = new EventEmitter<SampleGroup[]>();

  @ViewChild('sampleGroupTable')
  sampleGroupTable: Table | undefined;
  
  // aplication definitions
  readonly LANGUAGE_ID = "us"; // English: us; Spanish: es
  
  annotationGroupViewFormComponent: DynamicDialogRef | undefined;

  isLoading: boolean = false;
  sampleFilterGlobal = null;
  isAllSamplesSelected: boolean = false;
  samplesSelected: any = [];
  samplesFiltered: any = [];

  constructor(private dialogService: DialogService) {}

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
    });

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
    
  private createSampleGroups() {
    this.sampleGroups = [];

    this.samples.forEach(sample => {
      if (sample.groupName) {
        const sampleGroup = this.sampleGroups.find((sampleGroup: SampleGroup) => sampleGroup.name == sample.groupName);

        if (sampleGroup) {
          sampleGroup.samples.push(sample);
        }
        else {
          this.sampleGroups.push({
            name: sample.groupName,
            color: sample.groupColor,
            samples: [sample]
          });
        }
      }  
    });
  }

  onRowSelectAll(): void {
    if (this.isAllSamplesSelected) {
      this.isAllSamplesSelected = true;      
      this.samplesSelected = this.samplesFiltered;
    }
    else {
      this.isAllSamplesSelected = false;
      this.samplesSelected = [];
    }
  }
  
  onSampleFiltered(event) {
    this.samplesFiltered = event.filteredValue;
  }
  
  onApplyFilterGlobal($event: any, stringVal: any) {
    this.sampleGroupTable!.filterGlobal($event.value, stringVal);
  }
    
  onAddSampleGroup() {
    this.annotationGroupViewFormComponent = this.dialogService.open(SampleGroupFormViewComponent, {
      header: 'Sample Group',
      data: {
        sampleGroups: this.sampleGroups
      },
    });

    this.annotationGroupViewFormComponent.onClose.subscribe((sampleGroup: SampleGroup) => {
      if (sampleGroup == undefined)
        return;
                  
      this.samplesSelected.forEach(sampleSelected => {
        // add new sample group
        const sample = this.samples.find(sample => sample.sample_id == sampleSelected.sample_id);

        sample.groupName = sampleGroup.name;
        sample.groupColor = sampleGroup.color;
      });
      
      // create sample groups
      this.createSampleGroups();

      // refresh sample table
      this.samplesSelected = [];
      this.isAllSamplesSelected = false;
    });
  }
  
  onRemoveSampleGroup() {
    this.samplesSelected.forEach(sampleSelected => {
      // remove sample group color legend 
      const sample = this.samples.find(sample => sample.sample_id == sampleSelected.sample_id);
            
      if (sample) {
        sample.groupName = undefined;
        sample.groupColor = 'white';
      }            
    });
    
    // create sample groups
    this.createSampleGroups();
    
    // refresh sample table
    this.samplesSelected = [];
  }

  onApplySampleGroups() {
    this.onClearFilterGlobal();

    this.onSampleGroupFilterChartEvent.emit(this.sampleGroups);
  }  

  onClearFilterGlobal() {
    this.sampleGroupTable!.clear();
    this.sampleFilterGlobal = null;
  }
        
  onExportSampleGroups(event) {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.samplesFiltered);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        this.saveAsExcelFile(excelBuffer, 'sample_groups_data');
    });
  }  
}
