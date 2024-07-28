import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SaaSDashboardComponent } from './saas.dashboard.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SaaSDashboardComponent }
	])],
	exports: [RouterModule]
})
export class SaaSDashboardRoutingModule { }
