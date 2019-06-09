import {
    Component,
    OnInit
} from '@angular/core';

import { Router ,RouterLink } from '@angular/router';
import { DataService } from '../data.service';

@Component({
    selector: 'app-main',
    templateUrl: './mypage.component.html',
    styleUrls: ['./mypage.component.scss'],
})

export class MyPageComponent implements OnInit{
    isLoggedIn: string | null = null;

    public constructor(
        private router: Router,
        private dataService: DataService
    ) {}
    
    public ngOnInit() {
        this.dataService.verify().subscribe(() => {});
    }
}
