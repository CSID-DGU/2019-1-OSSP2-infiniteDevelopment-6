import {
    Component,
    OnInit,
    ViewChildren,
    QueryList,
} from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { Project, File } from '../types';
import { TabComponent } from './tab/tab.component';


@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit {
    project: Project;
    text: string = "";

    @ViewChildren("tabComponent") tabs:QueryList<TabComponent>;

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

    public clickFile(file: File) {
        if(file.isDirectory) {
            return;
        }
        
        const id = parseInt(this.route.snapshot.paramMap.get("id"));
        const {path, name, data} = file;

        if(!data) {
            this.dataService.getFile({id, path, name}).subscribe(value => {
                file.data = value.data;
                this.text = value.data;
            });
        }
        
        this.tabs.toArray()[0].pushFile(file);
    }
}
