import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationComponent } from './verification.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from 'src/app/layout/config/config.module';

@NgModule({
    imports: [
        CommonModule,
        VerificationRoutingModule,
        InputNumberModule,
        ButtonModule,
        RippleModule,
        AppConfigModule
    ],
    declarations: [VerificationComponent]
})
export class VerificationModule { }
