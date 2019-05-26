import {
    Component,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Problem } from '../types';
import { DataService } from '../data.service';

@Component({
    selector: 'app-problems',
    templateUrl: './problems.component.html',
    styleUrls: ['./problems.component.scss'],
})

export class ProblemsComponent implements OnInit{
    problems:Array<Problem> = [];
    
    public constructor(
        private dataService: DataService,
        private route: Router
    ) {}

    public ngOnInit() {
        this.dataService.getProblems({page: 0}).subscribe((value) => {
            this.problems = value;
        });
    }

    public getDate(dateString: string) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        return `${year}.${month}.${day}`;
    }

    public handleClickProblem(seq) {
        this.route.navigateByUrl(`/problems/${seq}`);
    }
}
