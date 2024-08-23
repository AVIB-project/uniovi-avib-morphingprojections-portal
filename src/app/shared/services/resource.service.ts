import { Injectable, } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';

import { Observable} from 'rxjs'

import { environment } from '../../../environments/environment';

import { Resource } from '../models/resource.model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {        
    readonly baseUrl: string = environment.URL + "/resources";
    
    constructor(private http: HttpClient) { }

    getResources(): Observable<any> {
        return this.http.get(`${this.baseUrl}/files`);
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
                })
            )            
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
        
    deleteResouce(organizationId: string, projectId: string, caseId: string, file: string) {
        return this.http.delete(`${this.baseUrl}/organizations/${organizationId}/projects/${projectId}/cases/${caseId}/file/${file}`);     
    }       
}