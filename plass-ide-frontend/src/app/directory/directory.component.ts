import {
    Component,
    OnInit
} from '@angular/core';;

import { CreatePopupComponent } from './createPopup/createPopup.component';

@Component({
    selector: 'app-directory',
    templateUrl: './directory.component.html',
    styleUrls: ['./directory.component.scss'],
})
export class DirectoryComponent implements OnInit {
    public createModal: boolean = false;

    public ngOnInit() {

    }

    public openCreatePopup() {
        this.createModal = true;
    }

    public closeModal($event) {
        this.createModal = false;
    }
}
