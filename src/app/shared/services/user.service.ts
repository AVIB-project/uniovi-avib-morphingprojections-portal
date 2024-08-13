import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { User } from '../models/user.model';
import { UserCase } from '../models/user-case.model';
@Injectable({ providedIn: 'root' })
export class UserService {
    readonly baseUrl: String = environment.URL + "/users";

    private userCase!: UserCase;

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

    loadUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}`);  
    } 
    
    loadUsersByOrganizationId(organizationId: String): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}` + "/organizations/" + organizationId);  
    } 
    
    loadUserById(userId: String): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}` + "/" + userId);  
    } 
    
    loadUserCases(userId: String): Observable<UserCase> {
        return this.http.get<UserCase>(`${this.baseUrl}` + "/" + userId + "/cases")
            .pipe(                
                map((userCase: UserCase) => {
                    this.userCase = userCase;

                    return this.userCase;
                }),
                catchError(error => this.handleError(error))
        );  
    }   

    saveUser(user: any): Observable<String> {
        return this.http.post<String>(`${this.baseUrl}`, user);  
    }

    deleteUser(userId: String): void {
        this.http.delete<void>(`${this.baseUrl}` + "/" + userId);  
    }
}