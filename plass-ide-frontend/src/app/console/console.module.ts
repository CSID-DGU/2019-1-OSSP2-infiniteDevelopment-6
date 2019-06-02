import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
// import { ConsoleRoutingModule } from './console-routing.module';
import { ConsoleComponent } from './console.component';
import { TabComponent } from './tab/tab.component';
import { NamePopupComponent } from './namePopup/namePopup.component';
import { AsideProblemComponent } from './problem/problem.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        ConsoleComponent, TabComponent, NamePopupComponent, AsideProblemComponent
    ],
    exports: [
        ConsoleComponent,
    ],
    providers: [],
})
export class ConsoleModule {}
