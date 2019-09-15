import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { SignupComponent } from './signup.component';

@NgModule({
    imports: [
        // ConsoleRoutingModule,
        SharedModule,
    ],
    declarations: [
        SignupComponent
    ],
    exports: [
        SignupComponent,
    ],
    providers: [],
})
export class SignupModule {}
