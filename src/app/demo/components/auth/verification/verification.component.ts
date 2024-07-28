import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    templateUrl: './verification.component.html'
})
export class VerificationComponent {

    constructor(private layoutService: LayoutService) {}

    get filledInput(): boolean {
        return this.layoutService.config().inputStyle === 'filled';
    }

    focusOnNext(inputEl: InputNumber){
        inputEl.input.nativeElement.focus();
    }

}
