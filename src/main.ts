import { compileExpresion } from "./parse.js";
import { MonteCarloMotor } from "./monteCarlo.js";
import { EvalFunction } from "mathjs";

let expresionStr : string = "3*x^4+x^2+3*x+2";
let dim : number = 100_000_000;
let lim_inf : number = 0.5;
let lim_sup : number = 1;


console.time('parseo');
let expresion : EvalFunction = compileExpresion(expresionStr);
console.timeEnd('parseo');
console.time('montecarlo');

console.timeEnd('montecarlo');


