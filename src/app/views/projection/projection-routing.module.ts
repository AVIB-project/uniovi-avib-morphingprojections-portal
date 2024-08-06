import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProjectionComponent } from './projection.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProjectionComponent }
	])],
	exports: [RouterModule]
})
export class ProjectionRoutingModule { }
