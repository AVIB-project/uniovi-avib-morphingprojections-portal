import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IngestionFormComponent } from './ingestion-form.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: IngestionFormComponent }
	])],
	exports: [RouterModule]
})
export class IngestionFormRoutingModule { }
