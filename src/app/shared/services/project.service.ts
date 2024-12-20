import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    readonly baseUrl: string = environment.URL + "/projects";

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
    
    getProjectById(projectId: String): Observable<Project> {
        return this.http.get<Project>(`${this.baseUrl}` + "/" + projectId)
            .pipe(
                catchError(this.handleError)
            );  
    } 
    
    getProjectsByOrganizationId(organizationId: String): Observable<Project[]> {
        return this.http.get<Project[]>(`${this.baseUrl}` + "/organizations/" + organizationId)
            .pipe(
                catchError(this.handleError)
            ); 
    }   
    
    saveProject(project: Project): Observable<String> {
        return this.http.post<String>(`${this.baseUrl}`, project)
            .pipe(
                catchError(this.handleError)
            );         
    }

    deleteProject(projectId: String): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}` + "/" + projectId)
            .pipe(
                catchError(this.handleError)
            );         
    }    
}