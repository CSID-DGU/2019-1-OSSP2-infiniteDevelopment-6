import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router';


@Component({
    selector: 'modal-name',
    templateUrl: './namePopup.component.html',
    styleUrls: ['./namePopup.component.scss'],
})
export class NamePopupComponent {
    @Input() modalOn: boolean = false;
    @Input() apply;
    @Output() modalOff: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    name: string = "";
    nameError: boolean = false;

    doubleSubmit: boolean = false;
    
    constructor(private dataService: DataService,
        private router: Router) {}

    public handleName(e) {
        this.name = e.target.value;
    }

    public create() {
        if(!this.validation()) { this.doubleSubmit = false; return; }
        this.doubleSubmit = true;

        // TODO : send data
        const body = {
            filename: this.name,
        };

        this.apply(body, ()=> {
            this.name = "";
            this.doubleSubmit = false;
        }, () => {
            this.modalOn = true;
            this.doubleSubmit = false;
        });
        this.modalOn = false;
    }

    private validation() {
        if(this.doubleSubmit) return false;

        let isValid = true;
        if (!this.name) {
            isValid = false;
            this.nameError = true;
            setTimeout(()=>{this.nameError = false;}, 800);
        }
        return isValid;
    }

    public cancel() {
        this.modalOn = false;
        this.name = "";
        this.modalOff.emit(false);
    }
}
