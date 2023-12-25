"use strict";

class Car {
    constructor() {
        this.color = null;        
    }

    setFarbe(color) {
        this.color = color;
    }
}

export class CarFactory {
    constructor() {
        this.mycar = null;
    }
    static makeClass() {
        if (this.mycar == null) {
            this.mycar = new Car();
        }
        return this.mycar;
    }
}
