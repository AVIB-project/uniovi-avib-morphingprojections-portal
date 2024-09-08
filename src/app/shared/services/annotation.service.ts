import { Injectable, } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { from, of, Observable, throwError } from 'rxjs'
import { map, filter, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { ContextService } from './context.service';

import { Annotation } from '../models/annotation.model';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  readonly baseUrl: string = environment.URL + "/annotations";

  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  private annotations: Annotation[];

  constructor(private http: HttpClient, private contextService: ContextService) { }

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

  private createEncodingAnnotation(annotationSelected: any, encodingType: string, coordenate: string, annotationSpace: string): Annotation {
    const annotation: Annotation = {
      caseId: this.contextService.getContext().caseId,
      name: coordenate + '_' + annotationSelected.name,
      description: coordenate.toUpperCase() + " expression annotation for " + annotationSelected.name,      
      group: 'encoding',
      space: annotationSpace,
      encodingName: annotationSelected.name,    
      type: 'numeric',
      label: {
        'us': coordenate.toUpperCase() + " " + annotationSelected.label['us'],
        'es': coordenate.toUpperCase() + " " + annotationSelected.label['es']
      },
      values: annotationSelected.values,
      colorized: false,
      precalculated: false,
      required: true
    }

    return annotation;
  }
  
  loadAnnotationsAvailableByCaseId(caseId: String | null): Observable<Annotation[]> {
    //return this.http.get<Annotation[]>(`${this.baseUrl}/cases/${caseId}` + "/available")
    return this.http.get<Annotation[]>(`${this.baseUrl}/cases/${caseId}`)
      .pipe(
        map((annotations: Annotation[]) => {
          this.annotations = annotations;

          return this.annotations;
        }),
        catchError(error => this.handleError(error))
      );  
  }

  getAnnotations(): Annotation[] {
    return this.annotations;     
  }
  
  setAnnotations(annotations: Annotation[]) {
    this.annotations = annotations;
  }

  getAllAnnotations(): Observable<Annotation[]> {
    return of(this.annotations)
      .pipe(
        map((annotations: Annotation[]) =>
          annotations.filter(annotation => annotation.group !== 'encoding')
        )
      );
  }

  getRequiredAnnotations(): Observable<Annotation[]> {
    return of(this.annotations)
      .pipe(
        map((annotations: Annotation[]) => 
          annotations.filter(annotation => annotation.required == true)
        ),
        catchError(error => this.handleError(error))
      );  
  }

  getSampleAnnotations(): Observable<Annotation[]> {
    return of(this.annotations)
      .pipe(
        map((annotations: Annotation[]) =>
          annotations.filter(annotation => annotation.group == 'sample')
        )
      );
  }
  
  getSampleRequiredAndMandatoryAnnotations(): Observable<Annotation[]> {
    return of(this.annotations)
      .pipe(
        map((annotations: Annotation[]) =>
          annotations.filter(annotation => (annotation.group == 'sample' && annotation.required == true))
        )
      );  
  }
  
  getEncodingAnnotations(): Observable<Annotation[]> {
    return of(this.annotations)
      .pipe(
        map((annotations: Annotation[]) =>
          annotations.filter(annotation =>
            annotation.space == 'primal' && (annotation.encoding == "supervised" || annotation.encoding == "unsupervised"))
            //(annotation.encoding == "supervised" || annotation.encoding == "unsupervised"))
        ),
        map(annotations => ([...annotations].sort((a, b) => a.encoding! > b.encoding! ? 1 : -1)))
      ); 
  }
     
  getColorizedAnnotation(): Observable<Annotation | undefined> {
    return of(this.annotations)
      .pipe(
        map((annotations: Annotation[]) =>
          annotations.find(annotation => annotation.colorized == true)
        )
      );
  }
  
  addSupervisedEncodingAnnotation(annotationSelected: Annotation, annotationSpace: string): Observable<Annotation> {
     return from(this.annotations)
      .pipe(
        filter((annotation: Annotation) => annotation.name == annotationSelected.name),
        map((annotation: Annotation) => {            
          // update annotation status
          annotation.encoding = 'supervised';
          annotation.space = annotationSpace;
           
          
          // insert new annotation encodings
          let encodedAnnotations: Annotation[] = [];

          encodedAnnotations.push(this.createEncodingAnnotation(annotation, "supervised", "x", annotationSpace));
          encodedAnnotations.push(this.createEncodingAnnotation(annotation, "supervised", "y", annotationSpace));

          this.annotations.push(...encodedAnnotations);

          return annotation;
        }),
        catchError(error => this.handleError(error))
      );  
  }

  addUnsupervisedEncodingAnnotation(annotationSelected: Annotation, annotationSpace: string): Observable<Annotation> {
    return from(this.annotations)
      .pipe(
        filter((annotation: Annotation) => annotation.name == annotationSelected.name),
        map((annotation: Annotation) => {
          // update annotation status
          annotation.encoding = 'unsupervised';
          annotation.space = annotationSpace;
          
          // insert new annotation encodings
          let encodedAnnotations: Annotation[] = [];

          encodedAnnotations.push(this.createEncodingAnnotation(annotation, "unsupervised", "x", annotationSpace));
          encodedAnnotations.push(this.createEncodingAnnotation(annotation, "unsupervised", "y", annotationSpace));

          this.annotations.push(...encodedAnnotations);

          return annotation;
        }),
        catchError(error => this.handleError(error))
      );   
  }
  
  deleteEncodingAnnotation(annotationSelected: Annotation): Observable<string |undefined> {
    // update annotation status
    annotationSelected.encoding = undefined;
    annotationSelected.encodingName = undefined;

    // remove the encoding annotations attached to the selected annotation
    this.annotations = this.annotations.filter(annotation => (annotation.encodingName != annotationSelected.name));

    return of(annotationSelected.name);
  }

  setColorizedEncodingAnnotation(annotationSelected: Annotation): Observable<boolean> {
    // set the colorized the annotation selected
    this.annotations.map(annotation => {
      if (annotation.group == annotationSelected.group) {
        if (annotation.name != annotationSelected.name)
          annotation.colorized = false;
        else
          annotation.colorized = true;
      }
    });

    return of(true);
  }

  getAnnotationById(annotationId: String): Observable<Annotation> {
    return this.http.get<Annotation>(`${this.baseUrl}` + "/" + annotationId);  
  } 
    
  upload(organizationId: string, projectId: string, caseId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    
    formData.append("file[]", file);    
    
    const req = new HttpRequest('POST', `${this.baseUrl}/organizations/${organizationId}/projects/${projectId}/cases/${caseId}`, formData, {      
      reportProgress: true,
      responseType: 'json'      
    });

    return this.http.request(req);
  }  

  saveAnnotation(annotation: any): Observable<String> {
    return this.http.post<String>(`${this.baseUrl}`, annotation);      
  }
  
  deleteAnnotation(annotationId: String): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}` + "/" + annotationId);  
  }   
}