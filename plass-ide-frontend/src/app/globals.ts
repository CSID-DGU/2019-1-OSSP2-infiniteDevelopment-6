import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class Globals {
    private _isLoggedIn = new Subject();
    isLoggedIn$ = this._isLoggedIn.asObservable();

    isLoggedIn() {
        this._isLoggedIn.next();
    }
}