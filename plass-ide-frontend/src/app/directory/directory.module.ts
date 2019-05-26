import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { DirectoryComponent } from './directory.component';
import { CreatePopupComponent } from './createPopup/createPopup.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        DirectoryComponent, CreatePopupComponent
    ],
    exports: [
        DirectoryComponent
    ],
    providers: [],
})
export class DirectoryModule {}
