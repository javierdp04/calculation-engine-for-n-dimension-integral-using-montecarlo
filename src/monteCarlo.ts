import { Scope, ResultData } from "./models/models";
import { NativeFunction } from "./parse";


export class MonteCarloMotor {
    public monteCarloEvaluationNVar(func : NativeFunction, dim : number, scope : Scope[]) : ResultData{
        if (dim<1) throw Error("Dimension is not valid");
        if (!scope || scope.length == 0) throw Error("Scope is not valid");
        scope.forEach( s => {
            if (s.lowerLimit >= s.upperLimit) {
                throw new Error(`Limits of variable: ${s.variable} are inconsistent`);
            }
        })

        const nVars : number = scope.length;
        const lowers : number[] = scope.map(s => s.lowerLimit);
        const ranges : number[] = scope.map(s => s.upperLimit - s.lowerLimit);


        const args : number[] = new Array(nVars);

        let sumOfPoints : number = 0;
        let sumOfSquares : number = 0;

        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < nVars; j++) {
                args[j] = Math.random() * ranges[j] + lowers[j];
            }
            const z = func.apply(null, args);
            sumOfPoints += z;
            sumOfSquares += (z * z);
        }

        const mean : number = sumOfPoints / dim;
        const meanOfSquares : number = sumOfSquares / dim;

        const varianceValue : number = Math.max(0, meanOfSquares - (mean * mean));
        const standardDeviation : number = Math.sqrt(varianceValue);

        const volume : number = ranges.reduce((acc, r) => acc * r, 1);


        return {
            result: volume*mean,
            variance: varianceValue,
            error: volume * (standardDeviation / Math.sqrt(dim))
        };
    }
};
