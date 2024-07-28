import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { AppConfigModule } from 'src/app/layout/config/config.module';
import { PasswordModule } from 'primeng/password';

@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        PasswordModule,
        AppConfigModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
