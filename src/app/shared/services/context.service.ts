import { Injectable, } from '@angular/core';

import { Context} from '../models/context.model';

@Injectable({
    providedIn: 'root'
})
export class ContextService {
    private _context: Context = new Context();
    
    public getContext(): Context {
        return this._context;
    }
}