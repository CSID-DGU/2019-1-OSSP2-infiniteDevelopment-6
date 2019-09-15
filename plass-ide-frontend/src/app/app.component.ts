import {
    Component,
    OnInit
} from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { Globals } from './globals';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    isLoggedIn: boolean = false;

    constructor(
        private dataService: DataService,
        private router: Router,
        private globals: Globals
    ) {
        console.log(this.globals);
        this.globals.isLoggedIn$.subscribe((value) => {
            this.isLoggedIn = true;
        });
    };

    public ngOnInit() {
        this.dataService.isLoggedIn().subscribe((value) => {
            this.isLoggedIn = true;
        }, (error) => {
            this.isLoggedIn = false;
        });
    }

    public signout() {
        this.dataService.signout().subscribe((value) => {
            this.isLoggedIn = false;
            this.router.navigateByUrl("/");
        });
    }
}
