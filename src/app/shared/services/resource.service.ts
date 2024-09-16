import { Injectable, } from '@angular/core';
import { HttpEvent, HttpClient, HttpRequest, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, throwError, } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Resource } from '../models/resource.model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {        
    readonly baseUrl: string = environment.URL + "/resources";

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
    
    getResources(): Observable<any> {
        return this.http.get(`${this.baseUrl}/files`)
            .pipe(
                catchError(this.handleError)
            );        
    }
    
    getResourcesByCaseId(caseId: string): Observable<Resource[]> {
        return this.http.get<Resource[]>(`${this.baseUrl}` + "/cases/" + caseId)
            .pipe(
                map((resources: Resource[]) => {
                    // parse resource file and get only the file name for each one
                    resources.forEach((resource: Resource) => {
                        let paths = resource.file.split('/')

                        resource.file = paths[2];
                    });

                    return resources;
                }),
                catchError(this.handleError)
            );        
    }      

    uploadResources(organizationId: string, projectId: string, caseId: string, type: string, description: string, file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append("type", type);    
        formData.append("description", description);    
        formData.append("file[]", file);    
        
        const req = new HttpRequest('POST', `${this.baseUrl}/organizations/${organizationId}/projects/${projectId}/cases/${caseId}`, formData, {      
            reportProgress: true,
            responseType: 'json'      
        });

        return this.http.request(req);
    }
    
    downloadResource(organizationId: string, projectId: string, caseId: string, filename: string): Observable<HttpResponse<any>> {   
        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'text/csv; charset=utf-8');
        
        return this.http.get(`http://localhost:8083/storage/organizations/${organizationId}/projects/${projectId}/cases/${caseId}/file/${filename}`, {
        //return this.http.get(`http://localhost:8082/resources/organizations/${organizationId}/projects/${projectId}/cases/${caseId}/file/${filename}`, {
        //return this.http.get(`${this.baseUrl}/organizations/${organizationId}/projects/${projectId}/cases/${caseId}/file/${filename}`, {
                headers: headers,
                observe: 'response',
                responseType: 'blob'
            });
    }
    
    deleteResouce(organizationId: string, projectId: string, caseId: string, filename: string) {
        return this.http.delete(`${this.baseUrl}/organizations/${organizationId}/projects/${projectId}/cases/${caseId}/file/${filename}`)
            .pipe(
                catchError(this.handleError)
            );        
    }       
}