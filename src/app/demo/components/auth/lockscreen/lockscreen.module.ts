import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockScreenRoutingModule } from './lockscreen-routing.module';
import { LockScreenComponent } from './lockscreen.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from 'src/app/layout/config/config.module';

@NgModule({
    imports: [
        CommonModule,
        LockScreenRoutingModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        AppConfigModule
    ],
    declarations: [LockScreenComponent]
})
export class LockScreenModule { }
