import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Case } from '../models/case.model';
import { UserCase } from '../models/user-case.model';

@Injectable({ providedIn: 'root' })
export class CaseService {
    readonly baseUrl: string = environment.URL + "/cases";

    private userCase!: UserCase;

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

    getCaseById(caseId: String): Observable<Case> {
        return this.http.get<Case>(`${this.baseUrl}` + "/" + caseId)
            .pipe(
                catchError(this.handleError)
            );        
    }   
    
    getCasesByOrganizationAndUser(organizationId: String, userId: String): Observable<UserCase> {
        return this.http.get<UserCase>(`${this.baseUrl}` + "/organizations/" + organizationId + "/users/" + userId)
            .pipe(                
                map((userCase: UserCase) => {
                    this.userCase = userCase;

                    return this.userCase;
                }),
                catchError(this.handleError)
        ); 
    } 
    
    saveCase(_case: any): Observable<String> {
        return this.http.post<String>(`${this.baseUrl}`, _case)
            .pipe(
                catchError(this.handleError)
            );        
    }

    deleteCase(caseId: String): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}` + "/" + caseId)
            .pipe(
                catchError(this.handleError)
            );         
    }     
}