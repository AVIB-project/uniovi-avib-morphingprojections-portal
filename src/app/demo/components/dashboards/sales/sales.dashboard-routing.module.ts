import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SalesDashboardComponent } from './sales.dashboard.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SalesDashboardComponent }
	])],
	exports: [RouterModule]
})
export class SalesDashboarRoutingModule { }
