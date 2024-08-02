import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { UserCase } from '../models/user-case.model';

@Injectable({
    providedIn: 'root'
})
export class UserCaseService {
    readonly baseUrl: string = environment.URL + "/organizations";

    readonly httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json'
        })
    };    

    private userCase!: UserCase;
    
    constructor(private http: HttpClient) { }  
    
    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
        } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }

        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
    
    loadUserCases(userId: string): Observable<UserCase> {
        return this.http.get<UserCase>(`${this.baseUrl}` + "/users/" + userId + "/aggregate")
            .pipe(                
                map((userCase: UserCase) => {
                    this.userCase = userCase;

                    return this.userCase;
                }),
                catchError(error => this.handleError(error))
        );  
    }  
    
    getUserCases(): UserCase {
        return this.userCase;     
    }
}