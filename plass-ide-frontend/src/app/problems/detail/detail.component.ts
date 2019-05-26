import {
    Component,
    OnInit
} from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Problem } from 'src/app/types';
import { ActivatedRoute } from '@angular/router';
import { newlineToBr } from '../../helper/escape-to-html';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})

export class DetailComponent implements OnInit {
    problem: Problem;

    public constructor(
        private dataService: DataService,
        private route: ActivatedRoute
    ) {}

    public ngOnInit() {
        const id = parseInt(this.route.snapshot.paramMap.get("id"));

        this.dataService.getProblem({id: id}).subscribe((value) => {
            this.problem = value;
            console.log(value);
        });
    }

    public escapeString(str: string) {
        console.log(newlineToBr(str))
        return newlineToBr(str);
    }
}
