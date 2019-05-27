import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { Project } from 'src/app/types';


@Component({
    selector: 'list-element',
    templateUrl: './element.component.html',
    styleUrls: ['./element.component.scss'],
})
export class ElementComponent {
    @Input() project: Project;
    @Output() openProject: EventEmitter<number> = new EventEmitter<number>();

    clickProject() {
        this.openProject.emit(this.project.id);
    }
}
