import { Pipe, PipeTransform } from '@angular/core';

import { AnnotationGroupEnum } from '../enum/annotation-group.enum';

@Pipe({ name:"AnnotationGroupPipe" })
export class AnnotationGroupPipe implements PipeTransform { 
    public annotationGroupEnum = AnnotationGroupEnum;
    public annotationGroupList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.annotationGroupList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationGroupEnum)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }

            this.annotationGroupList.push({id: propertyValue, name: propertyKey});
        }

        return this.annotationGroupList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationGroupEnum)) {
        if (propertyValue == Id)
            return propertyKey;
        }

        return null;
    }    
}