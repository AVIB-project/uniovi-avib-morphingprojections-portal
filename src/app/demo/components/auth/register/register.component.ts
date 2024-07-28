import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
	templateUrl: './register.component.html'
})
export class RegisterComponent {

	constructor(private layoutService: LayoutService) {}

	get filledInput(): boolean {
		return this.layoutService.config().inputStyle === 'filled';
	}

}
