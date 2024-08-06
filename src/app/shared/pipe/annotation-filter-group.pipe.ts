import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name:"AnnotationFilterGroupPipe" })
export class AnnotationFilterGroupPipe implements PipeTransform { 
    constructor() {
    }
    
    transform(values: any[], ...args: unknown[]): any[] {
        return values.filter(v => {
            if (args[2] == undefined)
                return v.annotation.group == args[0] && v.annotation.encoding == args[1];
            else
                return v.annotation.group == args[0] && v.annotation.encoding == args[1] && v.annotation.space == args[2];
        });
    }        
}