import {
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../types';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit {
    @ViewChild('editor') editor;
    project: Project;

    public constructor(
        private dataService: DataService,
        private route: ActivatedRoute
    ) {}

    public ngOnInit() {
        const id = parseInt(this.route.snapshot.paramMap.get("id"));
        // TODO: error exception

        this.dataService.getProject({id}).subscribe((project) => {
            this.project = project;
        }, (error) => {
            // TODO: error exception
        });
    }
}
