import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfigurationFormComponent } from './configuration-form.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ConfigurationFormComponent }
	])],
	exports: [RouterModule]
})
export class ConfigurationFormRoutingModule { }
