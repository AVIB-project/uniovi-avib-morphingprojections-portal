import { Injectable, } from '@angular/core';

import chroma from "chroma-js";

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    readonly FIRST_COLOR = "#ff0000";
    readonly MAX_COLORS = 10;
    readonly MIN_CONTRAST_RATIO = 3;
    readonly WHITE = chroma('white');
    readonly BLACK = chroma('black');

    colors: string[] = [];

    constructor() {
        this.colors = this.generateColorPair(this.MAX_COLORS);
    }

    private generateColorPair(numColor: number) {
        let bg = null,
        text = null;
    
        for (let i = 0; i < numColor; ++i) {      
            do {
                bg = chroma.random();                
                let contrastWithWhite = chroma.contrast(bg, this.WHITE),
                contrastWithBlack = chroma.contrast(bg, this.BLACK);
                
                if (contrastWithWhite >= this.MIN_CONTRAST_RATIO) {
                text = this.WHITE;
                } else if (contrastWithBlack >= this.MIN_CONTRAST_RATIO) {
                text = this.BLACK;
                }
            } while (text === null);
                
            this.colors.push(bg.hex());
        }

        //this.colors = chroma.cubehelix().rotations(3).scale().colors(numColor, 'hex');

        return this.colors;
    }   
    
    nextColor(index: number): string {
        return this.colors[index];
    }        
}