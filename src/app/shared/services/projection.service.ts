import { Injectable, } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { Observable} from 'rxjs'

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectionService {
    readonly baseUrl: string = environment.URL + "/projections";

    constructor(private http: HttpClient) { }

    getProjectionPrimal(resource: any): Observable<any> {
        const headers = { 'Content-Type': 'application/json' };
        const body = resource;

        return this.http.post<any>(`${this.baseUrl}/primal`, body, { headers });
    }

    getProjectionDual(resource: any): Observable<any> {
        const headers = { 'Content-Type': 'application/json' };
        const body = resource;
        
        return this.http.post<any>(`${this.baseUrl}/dual`, body, { headers });
    }    
}