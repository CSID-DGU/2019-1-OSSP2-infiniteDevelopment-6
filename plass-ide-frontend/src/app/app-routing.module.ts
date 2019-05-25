import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule,
} from '@angular/router';
import { CanActivateGuard } from './can-activate-guard';
import { ConsoleComponent } from './console/console.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DirectoryComponent } from './directory/directory.component';

const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'login', component: LoginComponent },
    // loadChildren: './login/login.module#LoginModule' },
    { path: 'directory', component: DirectoryComponent },
    { path: 'console', component: ConsoleComponent, canActivate: [CanActivateGuard] },
    // loadChildren: './console/console.module#ConsoleModule' },
    { path: '**', redirectTo: 'console' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
