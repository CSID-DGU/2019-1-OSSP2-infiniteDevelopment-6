import {
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    Observable,
    throwError,
} from 'rxjs';
import {
    map,
    catchError,
} from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ProblemContent, Problem } from './types';

@Injectable({
    providedIn: 'root',
})
export class DataService {

    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
    }

    private handleError(error: any) {
        if (error.status === 401) {
            this.router.navigateByUrl('/login');
            return throwError(false);
        }

        let errorBody: any = error['_body'];
        try {
            errorBody = JSON.parse(error['_body']);
        } catch (err) {
        }
        console.error('API ERROR', error, errorBody);
        return throwError(error.message || error);
    }

    public verify() {
        return this.http.get(`${this.apiUrl}/verify`)
            .pipe(
                map(() => true),
                catchError(error => this.handleError(error)),
            );
    }

    public signin(userId: string, userPw: string) {
        const payload = {
            userId,
            userPw,
        };

        return this.http.post(`${this.apiUrl}/signin`, payload)
            .pipe(
                map(() => true),
                catchError(error => this.handleError(error)),
            );
    }

    public getResult(hash: string, isError: boolean, index?: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/run/result/${hash}?is_error=${isError}&index=${index}`)
            .pipe(
                map((value: any) => value),
                catchError(error => this.handleError(error)),
            );
    }

    public getProblems({page=0, unit=10}: {page: number, unit?: number}): Observable<Array<Problem>> {
        return this.http.get(`${this.apiUrl}/problems?page=${page}&unit=${unit}`)
            .pipe(
                map((value: any) => value.problems),
                catchError(error => this.handleError(error))
            );
    }

    public getProblem({id}:{id: number}): Observable<Problem> {
        return this.http.get(`${this.apiUrl}/problems/${id}`)
            .pipe(
                map((value: any)=> value),
                catchError(error => this.handleError(error))
            );
    }
}
