import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    readonly baseUrl: string = environment.URL + "/analytics";

    readonly httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json'
        })
    };    

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

    executeTSNE(data: any[]): Observable<Object> { 
        return this.http.post(`${this.baseUrl}/tsne`, data);   
    }

    executeHistogram(data: any[]): Observable<Object> {       
        return this.http.post(`${this.baseUrl}/histogram`, data);   
    }  
    
    executeLogisticRegression(data: any[]): Observable<Object> {       
        return this.http.post(`${this.baseUrl}/logistic_regression`, data);   
    }      
}