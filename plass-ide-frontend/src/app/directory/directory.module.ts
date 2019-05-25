import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { DirectoryComponent } from './directory.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        DirectoryComponent,
    ],
    exports: [
        DirectoryComponent,
    ],
    providers: [],
})
export class DirectoryModule {}
