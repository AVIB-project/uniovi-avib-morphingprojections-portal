import { Injectable, } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { Observable} from 'rxjs'

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExpressionService {
    readonly baseUrl: string = environment.URL + "/expressions";

    constructor(private http: HttpClient) { }

    getExpressionsByAnnotationPrimal(resource: any): Observable<any> {
        const headers = { 'Content-Type': 'application/json' };
        const body = resource;

        return this.http.post<any>(`${this.baseUrl}/annotation`, body, { headers });
    }    

    getAnnotationsName(resource: any): Observable<any> {
        const headers = { 'Content-Type': 'application/json' };
        const body = resource;

        return this.http.post<any>(`${this.baseUrl}/annotations/name`, body, { headers });
    }    

    getAnnotationsValue(resource: any): Observable<any> {
        const headers = { 'Content-Type': 'application/json' };
        const body = resource;

        return this.http.post<any>(`${this.baseUrl}/annotations/value`, body, { headers });
    } 
}