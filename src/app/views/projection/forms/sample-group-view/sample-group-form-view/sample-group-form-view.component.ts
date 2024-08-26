import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ColorService} from '../../../../../shared/services/color.service';

import { SampleGroup } from '../../../../../shared/models/sample-group.model';

@Component({
  selector: 'sample-group-view-form',
  templateUrl: './sample-group-form-view.component.html',
  styleUrls: ['./sample-group-form-view.component.scss'],
})
export class SampleGroupFormViewComponent {  
  sampleGroupForm = this.fb.group({
    name: ['', Validators.required], 
    color: ['', Validators.required]
  });
  
  editMode: boolean = false;

  group: SampleGroup;
  sampleGroups: SampleGroup[] = [];

  constructor(private fb: FormBuilder, private ref: DynamicDialogRef, public config: DynamicDialogConfig, colorService: ColorService) {
    this.sampleGroups = this.config.data.sampleGroups;
    this.sampleGroupForm.reset(this.config.data.group);

    if (this.config.data.group != undefined) {
      this.editMode = true;
    }
    else {
      // set default values: name and color
      this.sampleGroupForm.controls.name.setValue("Group " + this.sampleGroups.length.toString());      
      this.sampleGroupForm.controls.color.setValue(colorService.nextColor(this.sampleGroups.length % 10));
    }
  }
  
  onSearchSampleGroup(event) {
    if (this.sampleGroups) {
      const sampleGroup = this.sampleGroups.find((sampleGroup: SampleGroup) => sampleGroup.name == this.sampleGroupForm.controls['name'].value);

      if (sampleGroup) {
        this.sampleGroupForm.controls["color"].setValue(sampleGroup.color);
      }
    }
  }

  addSampleGroup() {
    this.ref.close(this.sampleGroupForm.value);
  }  
}
