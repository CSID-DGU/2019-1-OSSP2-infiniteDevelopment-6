import {
    Component,
    OnInit
} from '@angular/core';;

import { Project } from '../types';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-directory',
    templateUrl: './directory.component.html',
    styleUrls: ['./directory.component.scss'],
})
export class DirectoryComponent implements OnInit {
    public createModal: boolean = false;
    public projects: Array<Project> = [];
    
    constructor(private dataService: DataService,
        private router: Router) {}

    public ngOnInit() {
        this.dataService.getProjects().subscribe(projects => {
            console.log(projects);
            this.projects = projects;
        }, error => {
            alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        });
    }
    
    public openCreatePopup() {
        this.createModal = true;
    }

    public closeModal($event) {
        this.createModal = false;
    }
}