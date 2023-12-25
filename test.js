"use strict";

import {CarFactory} from "./testlib.js";
let a = CarFactory.makeClass();
a.setFarbe("red");
console.log(a);

let b = CarFactory.makeClass();
b.setFarbe("blue");

console.log(a);
console.log(b);

