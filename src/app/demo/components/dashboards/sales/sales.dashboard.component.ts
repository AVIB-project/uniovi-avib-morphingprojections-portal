import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {SelectItem} from 'primeng/api';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

interface ListItem {
    image: string;
    text: string;
    subtext: string;
    ratio: string;
}

@Component({
    templateUrl: './sales.dashboard.component.html'
})
export class SalesDashboardComponent implements OnInit {

    orderWeek: any;

    selectedOrderWeek: any;

    products: Product[] = [];

    productsThisWeek: Product[] = [];

    productsLastWeek: Product[] = [];

    analytics: SelectItem[] = [];

    selectedDrop!: number;

    revenueChart: any;

    revenueOptions: any;

    chatMessages: any[] = [];

    activeTab = 0;

    activeListItemIndex = 1;

    activeListItem = {image: 'assets/demo/images/dashboard/headphones.svg', text: 'HF Headphones', subtext: 'Wireless', ratio: '+24%'};

    listItems: ListItem[] = [];

    @ViewChild('chatcontainer') chatContainerViewChild!: ElementRef;

    constructor(private productService: ProductService, public layoutService: LayoutService) {}

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data.slice(0, 5));
        this.productService.getProducts().then(data => this.productsThisWeek = data.slice(0, 5));
        this.productService.getProductsMixed().then(data => this.productsLastWeek = data.slice(0, 5));

        this.orderWeek = [
            {name: 'This Week', code: '0'},
            {name: 'Last Week', code: '1'}
        ];

        this.analytics = [
            {label: 'Products', value: 1},
            {label: 'Sales', value: 2},
            {label: 'Customers', value: 3}
        ];

        const documentStyle = getComputedStyle(document.documentElement);
        this.revenueChart = {
            labels: [
                'Online',
                'Retail',
                'Partner'
            ],
            datasets: [{
                data: [12, 32, 56],
                backgroundColor: [
                    documentStyle.getPropertyValue('--indigo-500'), 
                    documentStyle.getPropertyValue('--teal-500'), 
                    documentStyle.getPropertyValue('--purple-500')
                ],
                borderWidth: 0
            }]
        };

        this.revenueOptions = {
            plugins: {
                legend: {
                    display: false,
                }
            },
            responsive: true,
            cutout: 60
        };

        this.chatMessages = [
            { self: false, from: 'Jane Cooper', url: 'assets/demo/images/avatar/stephenshaw.png', messages: ['Hey M. hope you are well. Our idea is accepted by the board. '] },
            { self: true, from: 'Jerome Bell', url: 'assets/demo/images/avatar/ivanmagalhaes.png', messages: ['we did it! 🤠'] },
            { self: false, from: 'Darlene Robertson', url: 'assets/demo/images/avatar/amyelsner.png', messages: ['I will be looking at the process then, just to be sure 🤓 '] },
        ];

        this.listItems = [
            {image: 'assets/demo/images/dashboard/sneaker.png', text: 'Red Sneakers', subtext: 'RX Series', ratio: '+40%'},
            {image: 'assets/demo/images/dashboard/headphones.png', text: 'HF Headphones', subtext: 'Wireless', ratio: '+24%'},
            {image: 'assets/demo/images/dashboard/sunglasses.png', text: 'Sunglasses', subtext: 'UV Protection', ratio: '+17%'}
        ];
    }

    recentSales(code: string) {
        if (code === '0')
            this.products = this.productsThisWeek;
        else
            this.products = this.productsLastWeek;
    }

    onChatKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const message = (<HTMLInputElement> event.currentTarget).value;
            const lastMessage = this.chatMessages[this.chatMessages.length - 1];

            if (lastMessage.from) {
                this.chatMessages.push({ self: true, from: 'Jerome Bell',
                    url: 'assets/demo/images/avatar/ivanmagalhaes.png',
                    messages: [message] });
            }
            else {
                lastMessage.messages.push(message);
            }

            if (message.match(/primeng|primereact|primefaces|primevue/i)) {
                this.chatMessages.push({ nth: false, from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Always bet on Prime!'] });
            }

            (<HTMLInputElement> event.currentTarget).value = '';

            const el = this.chatContainerViewChild.nativeElement;
            setTimeout(() => {
                el.scroll({
                    top: el.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1);
        }
    }

    onTabClick(index: number) {
        this.activeTab = index;

        if (index === 0) {
            this.listItems = [
                {image: 'assets/demo/images/dashboard/sneaker.png', text: 'Red Sneakers', subtext: 'RX Series', ratio: '+40%'},
                {image: 'assets/demo/images/dashboard/headphones.png', text: 'HF Headphones', subtext: 'Wireless', ratio: '+24%'},
                {image: 'assets/demo/images/dashboard/sunglasses.png', text: 'Sunglasses', subtext: 'UV Protection', ratio: '+17%'}
            ];
        } else if (index === 1) {
            this.listItems = [
                {image: 'assets/demo/images/dashboard/camera.png', text: 'Instant Camera', subtext: 'II-Mark', ratio: '+27%'},
                {image: 'assets/demo/images/dashboard/cupcake.png', text: 'Cupcake', subtext: 'Cinnamon', ratio: '+41%'},
                {image: 'assets/demo/images/dashboard/drink.png', text: 'Cold Drink', subtext: 'Lime', ratio: '+56%'}
            ];
        } else if (index === 2) {
            this.listItems = [
                {image: 'assets/demo/images/dashboard/tripod.png', text: 'Tripod', subtext: 'Stabilizer', ratio: '+34%'},
                {image: 'assets/demo/images/dashboard/headphone2.png', text: 'Headphone', subtext: 'Wireless', ratio: '+67%'},
                {image: 'assets/demo/images/dashboard/spoon.png', text: 'Spoon Set', subtext: 'Colorful', ratio: '+8%'}
            ];
        }

        this.activeListItem = this.listItems[this.activeListItemIndex];
    }
}
