import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessdeniedRoutingModule } from './accessdenied-routing.module';
import { AccessdeniedComponent } from './accessdenied.component'
import { ButtonModule } from 'primeng/button';
import { AppConfigModule } from 'src/app/layout/config/config.module';

@NgModule({
    imports: [
        CommonModule,
        AccessdeniedRoutingModule,
        ButtonModule,
        AppConfigModule
    ],
    declarations: [AccessdeniedComponent]
})
export class AccessdeniedModule {}
