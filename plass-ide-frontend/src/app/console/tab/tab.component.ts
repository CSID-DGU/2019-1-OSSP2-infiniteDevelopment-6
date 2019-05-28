import {
    Component,
    Input,
} from '@angular/core';
import { File } from 'src/app/types';

@Component({
    selector: 'tab-component',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss'],
})

export class TabComponent {
    public files:Array<File> = [];
    public selectFile:File = null;
    public text:string = "";

    pushFile(file:File) {
        if(this.files.findIndex((value)=>(file === value)) !== -1) { this.selectFile = file; return; } // if files aready exsist

        this.files.push(file);
        if(this.files.length === 1) { this.clickFile(file) }; // if the pushed file is first
    }

    clickFile(file: File) {
        this.selectFile = file;
        this.text = file.data;
    }

    changeEditor() {
        if(this.selectFile) {
           this.selectFile.modify = true; 
           this.selectFile.data = this.text;
        } else {
            const tempFile: File = {
                name: "undefined",
                isDirectory: false,
                path: "",
                data: this.text,
                isTemp: true,
                modify: true
            }
            this.files.push(tempFile)
            this.selectFile = tempFile;
        }
    }
}
