import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectionService {
    readonly baseUrl: string = environment.URL + "/projections";

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
    
    getProjectionPrimal(resource: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/primal`, resource)
            .pipe(
                catchError(this.handleError)
            );        
    }

    getProjectionDual(resource: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/dual`, resource)
            .pipe(
                catchError(this.handleError)
            );        
    }    
}