import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { UserCase } from '../models/user-case.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    readonly baseUrl: string = environment.URL + "/cases";

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
        }

        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }  

    constructor(private http: HttpClient) { }

    getDashboardTotalResources(organizationId: String, userId: String): Observable<UserCase> {
        return this.http.get<any>(`${this.baseUrl}` + "/organizations/" + organizationId + "/users/" + userId + "/total")
            .pipe(
                catchError(this.handleError)
            );        
    }   
}