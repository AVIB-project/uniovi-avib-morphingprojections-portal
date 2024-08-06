import { Pipe, PipeTransform } from '@angular/core';

import { AnnotationSpaceEnum } from '../enum/annotation-space.enum';

@Pipe({ name:"AnnotationSpacePipe" })
export class AnnotationSpacePipe implements PipeTransform { 
    public annotationSpaceEnum = AnnotationSpaceEnum;
    public annotationSpaceList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.annotationSpaceList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationSpaceEnum)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }

            this.annotationSpaceList.push({id: propertyValue, name: propertyKey});
        }

        return this.annotationSpaceList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(AnnotationSpaceEnum)) {
        if (propertyValue == Id)
            return propertyKey;
        }

        return null;
    }    
}