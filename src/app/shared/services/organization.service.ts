import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, map } from 'rxjs'

import { environment } from '../../../environments/environment';

import { UserService } from '../services/user.service';
import { OrganizationCase } from '../models/organization-case.model';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    readonly baseUrl: string = environment.URL + "/users";

    readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        })
    };    

    constructor(private userService: UserService, private http: HttpClient) { }

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

    private createCasesByUser(configuration: any) {
        let organizationCases: any[] = []
        let organizationItem: any = {};        
        
        for (let organizationIndex in configuration) {
            for (let organizationKey of Object.keys(configuration[organizationIndex])) {
                if (organizationKey !== "projects") {
                    let key = organizationKey.charAt(0).toUpperCase() + organizationKey.slice(1);
                
                    organizationItem["organization" + key] = configuration[organizationIndex][organizationKey];
                }
                else {
                    if (configuration[organizationIndex][organizationKey].length > 0) {
                        for (let projectIndex in configuration[organizationIndex][organizationKey]) {
                            let projectItem: any = { ...organizationItem };

                            for (let projectKey of Object.keys(configuration[organizationIndex][organizationKey][projectIndex])) {
                                if (projectKey !== "cases") {
                                    let key = projectKey.charAt(0).toUpperCase() + projectKey.slice(1);
                            
                                    projectItem["project" + key] = configuration[organizationIndex][organizationKey][projectIndex][projectKey];
                                }
                                else {
                                    if (configuration[organizationIndex][organizationKey][projectIndex][projectKey].length > 0) {
                                        for (let caseIndex in configuration[organizationIndex][organizationKey][projectIndex][projectKey]) {
                                            let caseItem: any = { ...projectItem };

                                            for (let caseKey of Object.keys(configuration[organizationIndex][organizationKey][projectIndex][projectKey][caseIndex])) {
                                                let key = caseKey.charAt(0).toUpperCase() + caseKey.slice(1);

                                                caseItem["case" + key] = configuration[organizationIndex][organizationKey][projectIndex][projectKey][caseIndex][caseKey];
                                            }

                                            organizationCases.push(caseItem);
                                        }
                                    } else 
                                        organizationCases.push(projectItem);           
                                }
                            }                            
                        }
                    } else
                        organizationCases.push(organizationItem);
                }
            }
        } 
        
        return organizationCases;
    }    
    
    getCasesByUser(userId: string): Observable<OrganizationCase[]> { 
        return this.userService.loadUserCases(userId)
            .pipe(map((userCase: any) => {                    
                return this.createCasesByUser(userCase.organizations);
            }
        ))
    }      
}