import { compile } from 'mathjs'
import { EvalFunction } from "mathjs";

export function compileExpresion(stringExpresion : string) : EvalFunction {
    return compile(stringExpresion)
}




