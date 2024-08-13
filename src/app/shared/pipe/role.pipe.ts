import { Pipe, PipeTransform } from '@angular/core';

import { RoleEnum } from '../enum/role.enum';

@Pipe({ name:"RolePipe" })
export class RolePipe implements PipeTransform { 
    public roleEnum = RoleEnum;
    public roleList: any[] = [];

    constructor() {
    }
    
    transform(key: any): any {
        return this.getNameById(key);
    }

    getList() {
        this.roleList = [];
        
        for (const [propertyKey, propertyValue] of Object.entries(RoleEnum)) {
        if (!Number.isNaN(Number(propertyKey))) {
            continue;
        }

        this.roleList.push({id: propertyValue, name: propertyKey});
        }

        return this.roleList;
    }

    getNameById(Id: any) {
        for (const [propertyKey, propertyValue] of Object.entries(RoleEnum)) {
        if (propertyValue == Id)
            return propertyKey;
        }

        return null;
    }    
}