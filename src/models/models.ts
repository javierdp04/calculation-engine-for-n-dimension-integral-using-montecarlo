import { EvalFunction } from "mathjs";

export interface Scope {
    variable : string;
    lim_inf: number;
    lim_sup : number;
}

export interface ResultData {
    result : number;
    variance : number;
    error : number
}