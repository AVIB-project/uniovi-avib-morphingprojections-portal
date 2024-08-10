import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    readonly baseUrl: string = environment.URL + "/users";

    readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        })
    }; 

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
    
    constructor(private http: HttpClient) { }     

    loadUser(userId: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}` + "/users/" + userId)
            .pipe(
                map((user: User) => {
                    return user;
                }),
                catchError(error =>
                    this.handleError(error)
                )
        );  
    }    
}