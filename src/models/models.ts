import { EvalFunction } from "mathjs";

export interface Scope {
    variable : string;
    lowerLimit: number;
    upperLimit : number;
}

export interface ResultData {
    result : number;
    variance : number;
    error : number
}