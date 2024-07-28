import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundRoutingModule } from './notfound-routing.module';
import { NotfoundComponent } from './notfound.component';
import { ButtonModule } from 'primeng/button';
import { AppConfigModule } from 'src/app/layout/config/config.module';

@NgModule({
    imports: [
        CommonModule,
        NotfoundRoutingModule,
        ButtonModule,
        AppConfigModule
    ],
    declarations: [NotfoundComponent]
})
export class NotfoundModule { }
