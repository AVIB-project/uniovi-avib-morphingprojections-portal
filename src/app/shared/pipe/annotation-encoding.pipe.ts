import { Pipe, PipeTransform } from '@angular/core';

import { AnnotationEncodingEnum } from '../enum/annotation-encoding.enum';

@Pipe({ name:"AnnotationEncodingPipe" })
export class AnnotationEncodingPipe implements PipeTransform { 
    public annotationEncodingEnum = AnnotationEncodingEnum;
    public annotationEncodingList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.annotationEncodingList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationEncodingEnum)) {
        if (!Number.isNaN(Number(propertyKey))) {
            continue;
        }

        this.annotationEncodingList.push({id: propertyValue, name: propertyKey});
        }

        return this.annotationEncodingList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationEncodingEnum)) {
        if (propertyValue == Id)
            return propertyKey;
        }

        return null;
    }    
}