import {
    Component,
    OnInit
} from '@angular/core';
import { DataService } from './data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
    isLoggedIn: string|null = null;

    constructor(
        private dataService: DataService
    ) {};

    public ngOnInit() {
        this.isLoggedIn = localStorage.getItem("logged_in");
    }
    public signup() {
        alert("회원가입은 관리자를 통해 문의하세요.");
    }
}
