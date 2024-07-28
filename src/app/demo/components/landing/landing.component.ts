import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './landing.component.html'
})
export class LandingComponent {

    constructor(private layoutService: LayoutService) {}

    scrollTo(viewChild: HTMLElement) {
        viewChild.scrollIntoView({behavior: 'smooth'});
    }

    get backgroundStyle(): object {
        let path = 'assets/demo/images/landing/';
        let image = this.layoutService.config().colorScheme === 'dark' ? 'line-effect-dark.svg' : 'line-effect.svg'; 

        return {'background-image': 'url(' + path + image + ')'};
    }

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }
}
