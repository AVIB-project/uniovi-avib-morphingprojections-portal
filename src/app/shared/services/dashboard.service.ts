import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'

import { environment } from '../../../environments/environment';

import { UserCase } from '../models/user-case.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    readonly baseUrl: string = environment.URL + "/cases";

    private userCase!: UserCase;

    readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type':  'application/json'
        })
    };    

    constructor(private http: HttpClient) { }

    getDashboardTotalResources(organizationId: String, userId: String): Observable<UserCase> {
        return this.http.get<any>(`${this.baseUrl}` + "/organizations/" + organizationId + "/users/" + userId + "/total"); 
    }   
}