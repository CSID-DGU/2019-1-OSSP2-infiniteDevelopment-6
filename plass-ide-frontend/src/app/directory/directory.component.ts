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

    public selectProject($event, project) {
        const selectedProjects = this.projects.filter((value) => {
            return value.select;
        });

        const normalSelect = () => {
            selectedProjects.forEach((value) => {value.select = false;});
            project.select = !project.select;
        }
        
        const ctrlSelect = () => {
            project.select = !project.select;
        }

        const shiftSelect = () => {
            const selectIndex = this.projects.findIndex(value => value===project);
            const firstIndex = this.projects.findIndex(value => value===selectedProjects[0]);
            const lastIndex = this.projects.findIndex(value => value===selectedProjects[selectedProjects.length - 1]);
            let start, last;

            if(selectIndex < firstIndex) { 
                start = selectIndex; last = firstIndex;
            } else if ( selectIndex > firstIndex && selectIndex < lastIndex ) {
                start = firstIndex; last = selectIndex;
            } else if ( selectIndex > lastIndex){
                start = firstIndex; last = selectIndex;
            } else {
                normalSelect(); return;
            }
            
            selectedProjects.forEach((value) => value.select = false);
            for(let i = start; i <= last; i++) {
                this.projects[i].select = true;
            }
        }


        if($event.ctrlKey) ctrlSelect();
        else if($event.shiftKey) shiftSelect();
        else normalSelect();
    }
}