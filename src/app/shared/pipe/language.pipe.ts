import { Pipe, PipeTransform } from '@angular/core';

import { LanguageEnum } from '../enum/language.enum';

@Pipe({ name:"LanguagePipe" })
export class LanguagePipe implements PipeTransform { 
    public languageEnum = LanguageEnum;
    public languageList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.languageList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(LanguageEnum)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }

            this.languageList.push({id: propertyValue, name: propertyKey});
        }

        return this.languageList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(LanguageEnum)) {
            if (propertyValue == Id)
                return propertyKey;
        }

        return null;
    }    
}