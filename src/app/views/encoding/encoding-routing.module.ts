import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EncodingComponent } from './encoding.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EncodingComponent }
	])],
	exports: [RouterModule]
})
export class EncodingRoutingModule { }
