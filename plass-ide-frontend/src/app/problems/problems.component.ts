import {
    Component
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-problems',
    templateUrl: './problems.component.html',
    styleUrls: ['./problems.component.scss'],
})

export class ProblemsComponent{
    public constructor(
        private route: Router
    ) {}
    public handleClickProblem(seq) {
        this.route.navigateByUrl(`/problems/${seq}`)
    }
}
