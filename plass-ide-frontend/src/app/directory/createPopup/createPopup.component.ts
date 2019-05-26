import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';import { shiftInitState } from '@angular/core/src/view';


@Component({
    selector: 'app-createPopup',
    templateUrl: './createPopup.component.html',
    styleUrls: ['./createPopup.component.scss'],
})
export class CreatePopupComponent {
    @Input() modalOn: boolean = false;
    @Output() modalOff: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    projectName: string = "";
    projectType: string = "";
    nameError: boolean = false;
    typeError: boolean = false;

    public handleName(e) {
        this.projectName = e.target.value;
        console.log(this.projectName)
    }
    public handleType(e) {
        this.projectType = e.target.value;
        console.log(this.projectType);
    }

    public create() {
        if(!this.validation()) { return; }

        // TODO : send data
    }

    private validation() {
        let isValid = true;
        if (!this.projectName) {
            isValid = false;
            this.nameError = true;
            setTimeout(()=>{this.nameError = false;}, 800);
        }

        if( !this.projectType ) {
            isValid = false;
            this.typeError = true;
            setTimeout(()=>{this.typeError = false;}, 800);
        }

        return isValid;
    }

    public cancel() {
        this.modalOn = false;
        this.modalOff.emit(false);
    }
}
