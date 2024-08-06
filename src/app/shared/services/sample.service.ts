import { Injectable, } from '@angular/core';

import { of, from, Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

import { Sample } from '../models/sample.model';
import { Annotation } from '../models/annotation.model';
import { SampleGroup } from '../models/sample-group.model';

@Injectable({
    providedIn: 'root'
})
export class SampleService {
    readonly UNDEFINED_NAME = "Undefined";
    readonly UNDEFINED_COLOR = "#000000";

    private samples: Sample[] = [];
    
    private calculateHorizontalProjections(annotation: any) {
        let projections: any = {};
        let valueMin = 0;
        let valueMax = 0;
        let step = 0;
        
        if (annotation.type == "numeric") {
            this.samples.map((sample: any) => {
                const valueSample = sample[annotation.name!];
                valueMax = Math.max(valueMax, valueSample)
            });

            this.samples.map((sample: any) => {
                const valueSample = sample[annotation.name!];
                valueMin = Math.min(valueMin, valueSample)
            });
                    
            for (let i = 0; i < this.samples.length; i++) {
                let sample: any = this.samples[i];

                if (annotation.name) {
                    projections[this.samples[i].sample_id] = {
                        x: (sample[annotation.name] - valueMin) / (valueMax - valueMin),
                        y: 0.5
                    };
                }
            }
        }
        else if (annotation.type == "enumeration") {
            step = 1 / (annotation.values!.length - 1);

            for (let i = 0; i < annotation.values!.length; i++) {                                
                projections[annotation.values![i]] = {
                    x: i * step,
                    y: 0.5
                };
            }
        } 
        
        return projections;
    }

    private calculateVerticalProjections(annotation: any) {
        let projections: any = {};
        let valueMin = 0;
        let valueMax = 0;
        let step = 0;
        
        if (annotation.type == "numeric") {
            this.samples.map((sample: any) => { const valueSample = sample[annotation.name!]; valueMax = Math.max(valueMax, valueSample)});
            this.samples.map((sample: any) => { const valueSample = sample[annotation.name!]; valueMin = Math.min(valueMin, valueSample) });
                    
            for (let i = 0; i < this.samples.length; i++) {
                let sample: any = this.samples[i];

                if (annotation.name) {
                    projections[this.samples[i].sample_id] = {
                        x: 0.5,
                        y: (sample[annotation.name] - valueMin) / (valueMax - valueMin)
                    };
                }
            }
        }
        else if (annotation.type == "enumeration") {
            step = 1 / (annotation.values!.length - 1);

            for (let i = 0; i < annotation.values!.length; i++) {                                
                projections[annotation.values[i]] = {
                    x: 0.5,
                    y: i * step
                };
            }
        } 
        
        return projections;
    }
        
    private calculateCircleProjections(annotation: any) {
        let projections: any = {};
        let angle = 0;
        let value = 0;
        
        if (annotation.type == "numeric") {
            /*let distinctAnnotationArray = []
            this.samples.forEach((sample) => {
                if (!distinctAnnotationArray.includes(sample[annotation.name])) {
                    distinctAnnotationArray.push(sample[annotation.name]);
                }
            });*/

            //angle = (2 * Math.PI) / distinctAnnotationArray.length;
            angle = (2 * Math.PI) / this.samples.length;            
        } else if (annotation.type == "enumeration") {
            angle = (2 * Math.PI)/annotation.values!.length;
        }        
        
        for (var a = 0; a < (2 * Math.PI); a += angle){
            if (annotation.type == "numeric") {
                projections[this.samples[value].sample_id] = { x: Math.cos(a), y: Math.sin(a) };
            }
            else if (annotation.type == "enumeration") {
                projections[annotation.values[value]] = { x: Math.cos(a), y: Math.sin(a) };
            }

            value++;
        }        
        
        return projections;
    }

    loadSamples(samples: Sample[]) { 
        // initialize metadata to each samples point
        samples.map((sample: Sample, index: number) => {                      
            //sample.groupName = this.UNDEFINED_NAME;
            //sample.groupColor = this.UNDEFINED_COLOR;
            sample.visible = true;
        });

        //samples = JSON.parse(JSON.stringify(samples).replaceAll("\"\"","null").replaceAll("\"\"","\""));

        // set samples dataset in memory
        this.samples = samples;        
    }

    getSamples(): Sample[] {
        return this.samples;
    }
    
    getSamplesByGroup(group: SampleGroup) {
        return of(this.samples)
            .pipe(
                map((samples: Sample[]) =>
                    samples.filter(sample => sample.groupName == group.name)
                )
            ); 
    }

    hideSamplesByGroup(group: SampleGroup): Observable<number[]> {
        return of(this.samples)
            .pipe(
                map((samples: Sample[]) => {
                    // set hidden state for group
                    group.visible = false;

                    // create visible chart points
                    let visibleSamples : any[] = [];
                    this.samples.map((sample: Sample, index: number) => {
                        if (sample.groupName != group.name && sample.visible == true) {                            
                            visibleSamples.push(index);
                        } else {
                            sample.visible = false;
                        }
                    });

                    return visibleSamples;
                })
            ); 
    }

    showSamplesByGroup(group: SampleGroup): Observable<number[]> {
        return of(this.samples)
            .pipe(
                map((samples: Sample[]) => {
                    // set hidden state for group
                    group.visible = true;

                    // create visible chart points
                    let visibleSamples: any[] = [];
                    
                    this.samples.map((sample: Sample, index: number) => {
                        if (sample.groupName == group.name || sample.visible == true) {
                            sample.visible = true;
                            visibleSamples.push(index);
                        }
                    });

                    return visibleSamples;                    
                })                
            ); 
    }
    
    showAllSamples(): Observable<Sample[]> {
        return of(this.samples)
            .pipe(
                map((samples: Sample[]) => {
                    samples.map((sample: Sample, index: number) => {
                        sample.visible = true;
                    });

                    return this.samples;
                })
            ); 
    }

    updateSamples(annotation: Annotation, type?: string): Observable<any[]> {
        // calculate X/Y Projections from annotation enumerations
        let projections: any = undefined;

        if (type == "horizontal") {
            projections = this.calculateHorizontalProjections(annotation);
        }
        else if (type == "vertical") {
            projections = this.calculateVerticalProjections(annotation);
        }
        else if (type == "circle") {
            projections = this.calculateCircleProjections(annotation);
        }
        else {
            projections = this.calculateCircleProjections(annotation);
        }      

        // update all samples adding the new projection for the encoded annotation
        return of(this.samples)
            .pipe(
                map((samples: any[]) => {
                    samples.map(sample => {   
                        try {
                            if (annotation.type == "numeric") {
                                if (annotation.group == "projection") {
                                    sample["x_" + annotation.name] = projections[sample.sample_id].x;
                                    sample["y_" + annotation.name] = projections[sample.sample_id].y;
                                } else {
                                    sample["x_" + annotation.name] = projections[sample.sample_id].x;
                                    sample["y_" + annotation.name] = projections[sample.sample_id].y;
                                }
                            }
                            else {
                                if (sample[annotation.name!] != undefined) {
                                    sample["x_" + annotation.name] = projections[sample[annotation.name!]].x;
                                    sample["y_" + annotation.name] = projections[sample[annotation.name!]].y;
                                }
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    });
                    
                    return this.samples;
                }),
                catchError(error => throwError(() => new Error('Something bad happened; please try again later.')))
            )
    }
}