import { Pipe, PipeTransform } from '@angular/core';

import { ResourceTypeEnum } from '../enum/resource-type.enum';

@Pipe({ name:"ResourceTypePipe" })
export class ResourceTypePipe implements PipeTransform { 
    public resourceTypeEnum = ResourceTypeEnum;
    public resourceTypeList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.resourceTypeList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(ResourceTypeEnum)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }

            // filer possible Resources to be uploaded from UI
            if ([
                ResourceTypeEnum.DATAMATRIX,
                ResourceTypeEnum.SAMPLE_ANNOTATION,
                ResourceTypeEnum.ATTRIBUTE_ANNOTATION].includes(propertyValue)) {
                    this.resourceTypeList.push({ id: propertyValue, name: propertyKey });
            }
        }

        return this.resourceTypeList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(ResourceTypeEnum)) {
        if (propertyValue == Id)
            return propertyKey;
        }

        return null;
    }    
}