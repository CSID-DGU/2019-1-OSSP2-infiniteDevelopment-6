import {
    Component,
    OnInit
} from '@angular/core';

import { Router ,RouterLink } from '@angular/router';
import { DataService } from '../data.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})

export class MainComponent implements OnInit{
    isLoggedIn: boolean = false;

    public constructor(
        private router: Router,
        private dataService: DataService
    ) {}
    
    public ngOnInit() {
        this.dataService.verify().subscribe((value) => {
            this.isLoggedIn = value;
        });
    }

    public async onClickGetStart() {
        if(this.isLoggedIn) {
            await this.router.navigateByUrl("directory");
        } else {
            await this.router.navigateByUrl("login");
        }
    }
}
