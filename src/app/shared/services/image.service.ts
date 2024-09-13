import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Image } from '../models/image.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
    readonly baseUrl: string = environment.URL + "/images";

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

    getImagesByOrganization(organizationId: String): Observable<Image[]> { 
        return this.http.get<Image[]>(`${this.baseUrl}` + "/organizations/" + organizationId)
            .pipe(
                catchError(this.handleError)
            );
    }
    
    saveImage(image: Image): Observable<String> {
        return this.http.post<String>(`${this.baseUrl}`, image)
            .pipe(
                catchError(this.handleError)
            );       
    }

    deleteImage(imageId: String): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}` + "/" + imageId)
            .pipe(
                catchError(this.handleError)
            );        
    }     
}