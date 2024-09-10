import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EncodingFormComponent } from './encoding-form.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EncodingFormComponent }
	])],
	exports: [RouterModule]
})
export class EncodingFormRoutingModule { }
