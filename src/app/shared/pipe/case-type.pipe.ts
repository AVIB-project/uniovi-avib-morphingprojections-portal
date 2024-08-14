import { Pipe, PipeTransform } from '@angular/core';

import { CaseTypeEnum } from '../enum/case-type.enum';

@Pipe({ name:"CaseTypePipe" })
export class CaseTypePipe implements PipeTransform { 
    public caseTypeEnum = CaseTypeEnum;
    public caseTypeList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.caseTypeList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(CaseTypeEnum)) {
            this.caseTypeList.push({id: propertyValue, name: propertyKey});
        }

        return this.caseTypeList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(CaseTypeEnum)) {
            if (propertyValue == Id)
                return propertyKey;
        }

        return null;
    }    
}