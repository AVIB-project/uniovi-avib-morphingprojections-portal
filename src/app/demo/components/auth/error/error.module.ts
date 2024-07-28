import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { ButtonModule } from 'primeng/button';
import { AppConfigModule } from 'src/app/layout/config/config.module';

@NgModule({
    imports: [
        CommonModule,
        ErrorRoutingModule,
        ButtonModule,
        AppConfigModule
    ],
    declarations: [ErrorComponent]
})
export class ErrorModule { }
