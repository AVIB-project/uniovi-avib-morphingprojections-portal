import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Job } from '../models/job.model';
import { JobSubmit } from '../models/job-submit.model';

@Injectable({ providedIn: 'root' })
export class JobService {
    readonly baseUrl: string = environment.URL + "/jobs";

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

    private getTime(job: Job): string {
        let diffTime;
        if (job.state == "Running")
            diffTime = Math.abs(new Date(new Date()).getTime() - new Date(job.jobCreationDate).getTime());
        else
            diffTime = Math.abs(new Date(job.jobFinalizeDate).getTime() - new Date(job.jobCreationDate).getTime());
        
        const minutes = Math.floor(diffTime / 60000);
        const seconds = Math.floor((diffTime - minutes * 60000)/1000);

        return minutes.toString() + " min, " + seconds.toString() + " sec";
    }
    
    getAllByCaseId(caseId: String): Observable<Job[]> {
        return this.http.get<Job[]>(`${this.baseUrl}` + "/cases/" + caseId)
            .pipe(
                map((jobs: Job[]) => {
                    jobs.forEach((job) => {
                        job.diffTime = this.getTime(job);                        
                    });

                    return jobs;
                }),
                catchError(error =>
                    this.handleError(error)
                )
            ); 
    }   
        
    getJobLogs(jobName: String): Observable<String> {
        return this.http.get<String>(`${this.baseUrl}`+ "/" + jobName + "/getJobLogs");  
    }

    submitJob(jobSubmit: JobSubmit): Observable<any> {
        return this.http.post<void>(`${this.baseUrl}` + "/submitJob", jobSubmit);  
    }     
}