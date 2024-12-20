import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { Router } from '@angular/router';

import { NgEventBus, MetaData } from 'ng-event-bus';

import { LayoutService } from 'src/app/layout/service/app.layout.service';

import { UserSession } from '../../shared/models/user-session.model';

import { DashboardService } from '../../shared/services/dashboard.service';
import { ContextService } from '../../shared/services/context.service';
import { UserService } from '../../shared/services/user.service';

import { EventType } from '../../shared/enum/event-type.enum';

@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    subscriptionEvents: any; 
    eventType = EventType;

    overviewChartData: any;

    overviewChartOptions: any;

    overviewWeeks: any;

    selectedOverviewWeek: any ;

    revenueChartData: any;

    revenueChartOptions: any;

    subscription: Subscription;

    dashboardResources: any = {};

    userSessions: UserSession[] = [];

    constructor(public layoutService: LayoutService, private dashboardService: DashboardService,
        private userService: UserService, private eventBus: NgEventBus, private contextService: ContextService, private router: Router,) { 
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initCharts();
            });
    }

    private loadDashboardResources(organizationId: String, userId: String) {
        this.dashboardService.getDashboardTotalResources(organizationId, userId)
            .subscribe({
                next: (dashboardResources: any) => {
                    this.dashboardResources = dashboardResources; 
                    
                    console.log(this.dashboardResources);
                },
                error: error => {
                    console.error(error.message);
                }
            });
    }
    
    private getUserSessions() {
        this.userService.getUserSessions('avib')
            .subscribe({
                next: (userSessions: UserSession[]) => {
                    this.userSessions = userSessions; 
                    
                    console.log(this.userSessions);
                },
                error: error => {
                    console.error(error.message);
                }
            });
    }

    ngOnInit() {
        this.initCharts();

        this.overviewWeeks = [
            {name: 'Last Week', code: '0'},
            {name: 'This Week', code: '1'}
        ];
        this.selectedOverviewWeek = this.overviewWeeks[0]

        // From case selector item
        this.subscriptionEvents = this.eventBus.on(this.eventType.APP_SELECT_CONTEXT)
            .subscribe((meta: MetaData) => {
                if (meta.data.organizationId) {
                    this.loadDashboardResources(meta.data.organizationId, meta.data.user.userId);
                }
            });
        
        // From menu item
        if (this.contextService.getContext().organizationId && this.contextService.getContext().user.userId) {
            this.loadDashboardResources(this.contextService.getContext().organizationId, this.contextService.getContext().user.userId);
        }  
        
        // get User Sessions
        this.getUserSessions();
    }

    onUsersViewClick() {
        this.router.navigate(['/user']);    
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const primaryColor = documentStyle.getPropertyValue('--primary-color');
        const primaryColor300 = documentStyle.getPropertyValue('--primary-200');
        const borderColor = documentStyle.getPropertyValue('--surface-border');

        this.overviewChartData = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [
                {
                    label: 'Organic',
                    data: [2, 1, 0.5, 0.6, 0.5, 1.3, 1],
                    borderColor: [
                        primaryColor
                    ],
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    type: 'line',
                    fill: false,
                },
                {
                    label: 'Referral',
                    data: [4.88, 3, 6.2, 4.5, 2.1, 5.1, 4.1],
                    backgroundColor: [this.layoutService.config().colorScheme === 'dark' ? '#879AAF' : '#E4E7EB'] ,
                    hoverBackgroundColor: [primaryColor300],
                    fill: true,
                    borderRadius: 10,
                    borderSkipped: 'top bottom',
                    barPercentage: 0.3
                }
            ]
        };

        this.overviewChartOptions = {
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'end',
                    labels: {
                        color: textColorSecondary
                    }
                }
            },
            responsive: true,
            hover: {
                mode: 'index'
            },
            scales: {
                y: {
                    max: 7,
                    min: 0,
                    ticks: {
                        stepSize: 0,
                        callback: function(value: number, index: number) {
                            if (index === 0) {
                                return value;
                            }
                            else {
                                return value + 'k';
                            }
                        },
                        color: textColorSecondary
                    },
                    grid: {
                        borderDash: [2, 2],
                        color: borderColor,
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        color: textColorSecondary
                    }
                }
            }
        };

        this.revenueChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    data: [11, 17, 30, 60, 88, 92],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: .4
                },
                {
                    data: [11, 19, 39, 59, 69, 71],
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: false,
                    tension: .4
                },
                {
                    data: [11, 17, 21, 30, 47, 83],
                    backgroundColor: 'rgba(25, 146, 212, 0.2)',
                    borderColor: 'rgba(25, 146, 212, 0.5)',
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'transparent',
                    fill: true,
                    tension: .4
                }
            ]
        };

        this.revenueChartOptions = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: borderColor
                    },
                    max: 100,
                    min: 0,
                    ticks: {
                        color: textColorSecondary
                    }
                },
                x: {
                    grid: {
                        color: borderColor
                    },
                    ticks: {
                        color: textColorSecondary,
                        beginAtZero: true
                    }
                }
            }
        };
    }

    changeOverviewWeek() {
        const dataSet1 = [
            [2, 1, 0.5, 0.6, 0.5, 1.3, 1],
            [4.88, 3, 6.2, 4.5, 2.1, 5.1, 4.1]
        ];
        const dataSet2 = [
            [3, 2.4, 1.5, 0.6, 4.5, 3.3, 2],
            [3.2, 4.1, 2.2, 5.5, 4.1, 3.6, 3.5],
        ];

        if (this.selectedOverviewWeek.code === '1') {
            this.overviewChartData.datasets[0].data = dataSet2[parseInt('0')];
            this.overviewChartData.datasets[1].data = dataSet2[parseInt('1')];
        } 
        else {
            this.overviewChartData.datasets[0].data = dataSet1[parseInt('0')];
            this.overviewChartData.datasets[1].data = dataSet1[parseInt('1')];
        }

        this.overviewChartData = {...this.overviewChartData};
    }

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        if(this.subscriptionEvents)
            this.subscriptionEvents.unsubscribe();        
    }
}
