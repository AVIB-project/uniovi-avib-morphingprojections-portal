import { Pipe, PipeTransform } from '@angular/core';

import { AnnotationProjectionEnum } from '../enum/annotation-projection.enum';

@Pipe({ name:"AnnotationProjectionPipe" })
export class AnnotationProjectionPipe implements PipeTransform { 
    public annotationProjectionEnum = AnnotationProjectionEnum;
    public annotationProjectionList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.annotationProjectionList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationProjectionEnum)) {
        if (!Number.isNaN(Number(propertyKey))) {
            continue;
        }

        this.annotationProjectionList.push({id: propertyValue, name: propertyKey});
        }

        return this.annotationProjectionList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationProjectionEnum)) {
        if (propertyValue == Id)
            return propertyKey;
        }

        return null;
    }    
}