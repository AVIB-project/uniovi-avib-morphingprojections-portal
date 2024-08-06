import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IngestionComponent } from './ingestion.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: IngestionComponent }
	])],
	exports: [RouterModule]
})
export class IngestionRoutingModule { }
