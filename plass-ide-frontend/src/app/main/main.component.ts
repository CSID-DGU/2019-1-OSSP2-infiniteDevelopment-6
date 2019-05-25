import {
    Component
} from '@angular/core';

import { Router ,RouterLink } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})

export class MainComponent{
    public constructor(
        private router: Router
    ) {}

    public async onClickGetStart() {
        await this.router.navigateByUrl("login");
    }
}
