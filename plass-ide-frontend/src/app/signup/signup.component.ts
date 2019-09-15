import {
    Component,
    OnInit
} from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})

export class SignupComponent {
    user = {
        username: undefined,
        password: undefined,
        name: undefined,
        email: undefined,
        birth: undefined
    }

    public constructor(
        private dataService: DataService,
        private router: Router
    ) {}

    signup() {
        const { username, password, name, email, birth } = this.user;
        if(!username || !password || !name || !email || !birth ) {
            alert("입력값을 확인하세요")
        }

        this.dataService.signup(this.user).subscribe(() => {
            alert("회원가입을 축하합니다");
            this.router.navigateByUrl('/');
        }, (error) => {
            alert("입력값을 확인하세요!");
        })
    }
    
    typing($event, target) {
        this.user[target] = $event.target.value;
    }
}