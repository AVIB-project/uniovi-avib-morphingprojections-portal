import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { SalesDashboarRoutingModule } from './sales.dashboard-routing.module';
import { SalesDashboardComponent } from './sales.dashboard.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProgressBarModule } from 'primeng/progressbar';
import { KnobModule } from 'primeng/knob';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        TagModule,
        BadgeModule,
        TooltipModule,
        TableModule,
        InputNumberModule,
        ChartModule,
        DropdownModule,
        FormsModule,
        CalendarModule,
        AvatarModule,
        AvatarGroupModule,
        ProgressBarModule,
        KnobModule,
        SalesDashboarRoutingModule,
        InputGroupModule,
        InputGroupAddonModule
    ],
    declarations: [SalesDashboardComponent]
})
export class SalesDashboardModule { }
