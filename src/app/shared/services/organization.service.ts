import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, map } from 'rxjs'
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { UserService } from '../services/user.service';
import { CaseService } from '../services/case.service';

import { OrganizationCase } from '../models/organization-case.model';
import { Organization } from '../models/organization.model';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    readonly baseUrl: string = environment.URL + "/organizations";

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

    private mapCasesByUser(configuration: any) {
        let organizationCases: any[] = []
        let organizationItem: any = {};        
        
        for (let organizationIndex in configuration) {
            for (let organizationKey of Object.keys(configuration[organizationIndex])) {
                if (organizationKey !== "projects") {
                    if (organizationKey !== "organizationId") {
                        let key = organizationKey.charAt(0).toUpperCase() + organizationKey.slice(1);
                
                        organizationItem["organization" + key] = configuration[organizationIndex][organizationKey];
                    } else {
                        organizationItem[organizationKey] = configuration[organizationIndex][organizationKey];
                    }
                }
                else {
                    if (configuration[organizationIndex][organizationKey].length > 0) {
                        for (let projectIndex in configuration[organizationIndex][organizationKey]) {
                            let projectItem: any = { ...organizationItem };

                            for (let projectKey of Object.keys(configuration[organizationIndex][organizationKey][projectIndex])) {
                                if (projectKey !== "cases") {
                                    if (projectKey !== "projectId") {
                                        let key = projectKey.charAt(0).toUpperCase() + projectKey.slice(1);
                            
                                        projectItem["project" + key] = configuration[organizationIndex][organizationKey][projectIndex][projectKey];
                                    } else {
                                        projectItem[projectKey] = configuration[organizationIndex][organizationKey][projectIndex][projectKey];
                                    }
                                }
                                else {
                                    if (configuration[organizationIndex][organizationKey][projectIndex][projectKey].length > 0) {
                                        for (let caseIndex in configuration[organizationIndex][organizationKey][projectIndex][projectKey]) {
                                            let caseItem: any = { ...projectItem };

                                            for (let caseKey of Object.keys(configuration[organizationIndex][organizationKey][projectIndex][projectKey][caseIndex])) {
                                                if (caseKey !== "caseId") {
                                                    let key = caseKey.charAt(0).toUpperCase() + caseKey.slice(1);

                                                    caseItem["case" + key] = configuration[organizationIndex][organizationKey][projectIndex][projectKey][caseIndex][caseKey];
                                                } else {
                                                    caseItem[caseKey] = configuration[organizationIndex][organizationKey][projectIndex][projectKey][caseIndex][caseKey];
                                                }
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
    
    constructor(private http: HttpClient, private userService: UserService, private caseService: CaseService) { }

    getCasesByOrganizationAndUser(organizationId: string, userId: string): Observable<OrganizationCase[]> { 
        return this.caseService.getCasesByOrganizationAndUser(organizationId, userId)
            .pipe(map((userCase: any) => {                    
                return this.mapCasesByUser(userCase.organizations);
            }),
            catchError(this.handleError
        ));
    }
    
    saveOrganization(organization: Organization): Observable<String> {
        return this.http.post<String>(`${this.baseUrl}`, organization)
            .pipe(
                catchError(this.handleError)
            );         
    }

    deleteOrganization(organizationId: String): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}` + "/" + organizationId)
            .pipe(
                catchError(this.handleError)
            );        
    }
}