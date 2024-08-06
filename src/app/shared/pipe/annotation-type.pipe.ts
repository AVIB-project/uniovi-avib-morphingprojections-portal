import { Pipe, PipeTransform } from '@angular/core';

import { AnnotationTypeEnum } from '../enum/annotation-type.enum';

@Pipe({ name:"AnnotationTypePipe" })
export class AnnotationTypePipe implements PipeTransform { 
    public annotationTypeEnum = AnnotationTypeEnum;
    public annotationTypeList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.annotationTypeList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationTypeEnum)) {
        if (!Number.isNaN(Number(propertyKey))) {
            continue;
        }

        this.annotationTypeList.push({id: propertyValue, name: propertyKey});
        }

        return this.annotationTypeList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationTypeEnum)) {
        if (propertyValue == Id)
            return propertyKey;
        }

        return null;
    }    
}