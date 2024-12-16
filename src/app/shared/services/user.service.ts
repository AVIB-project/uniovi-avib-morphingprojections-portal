import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { User } from '../models/user.model';
import { UserSession } from '../models/user-session.model';
import { UserCase } from '../models/user-case.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    readonly baseUrl: String = environment.URL + "/users";

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

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}`)
            .pipe(
                catchError(this.handleError)
            ); 
    } 
    
    getUsersByOrganizationId(organizationId: String): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}` + "/organizations/" + organizationId)
            .pipe(
                catchError(this.handleError)
            );        
    } 
    
    getUserById(userId: String): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}` + "/" + userId)
            .pipe(
                catchError(this.handleError)
            );         
    } 
    
    getUserByExternalId(externalId: String): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}` + "/" + externalId + "/external")
            .pipe(
                catchError(this.handleError)
            );  
    } 
    
    getUserByEmail(email: String): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}` + "/" + email + "/email")
            .pipe(
                catchError(this.handleError)
            );
    } 
    
    getUserCases(userId: String): Observable<UserCase> {
        return this.http.get<UserCase>(`${this.baseUrl}` + "/" + userId + "/cases")
            .pipe(                
                map((userCase: UserCase) => {
                    this.userCase = userCase;

                    return this.userCase;
                }),
                catchError(this.handleError)
            );  
    } 

    saveUser(user: any): Observable<String> {
        return this.http.post<String>(`${this.baseUrl}`, user)
            .pipe(
                catchError(this.handleError)
            );
    }

    resetPassword(userId: String, password: String): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}` + "/" + userId + "/resetPassword", password)
            .pipe(
                catchError(this.handleError)
            );  
    }
    
    deleteUser(userId: String): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}` + "/" + userId)
            .pipe(
                catchError(this.handleError)
            ); 
    }

    inviteUserByEmail(data: any): Observable<number> {       
        return this.http.post<number>(`${this.baseUrl}` + "/inviteUser", data)
            .pipe(
                catchError(this.handleError)
            );
    } 

    getUserSessions(realm: String): Observable<UserSession[]> {       
        return this.http.get<UserSession[]>(`${this.baseUrl}` + "/realms/" + realm + "/sessions")
            .pipe(
                catchError(this.handleError)
            ); 
    }     
}