import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CaseComponent } from './case.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CaseComponent }
	])],
	exports: [RouterModule]
})
export class CaseRoutingModule { }
