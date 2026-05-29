import { Scope, ResultData } from "./models/models";
import { NativeFunction } from "./parse";


export class MonteCarloMotor {
    public monteCarloEvaluationNVar(funct : NativeFunction, dim : number, scope : Scope[]) : ResultData{
        if (dim<1) throw Error("Dimension is not valid");
        if (!scope || scope.length == 0) throw Error("Scope is not valid");
        scope.forEach( s => {
            if (s.lim_inf >= s.lim_sup) {
                throw new Error(`Limits of variable: ${s.variable} are inconsistent`);
            }
        })

        const nVars : number = scope.length;
        const lowers : number[] = scope.map(s => s.lim_inf);
        const ranges : number[] = scope.map(s => s.lim_sup - s.lim_inf);


        const args : number[] = new Array(nVars);

        let sumOfPoints : number = 0;
        let sumOfSquares : number = 0;

        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < nVars; j++) {
                args[j] = Math.random() * ranges[j] + lowers[j];
            }
            const z = funct.apply(null, args);
            sumOfPoints += z;
            sumOfSquares += (z * z);
        }

        let mean : number = sumOfPoints / dim;
        let meanOfSquares : number = sumOfSquares / dim;

        let varianceValue : number = Math.max(0, meanOfSquares - (mean * mean));
        let standarDesviation : number = Math.sqrt(varianceValue);

        let volume : number = ranges.reduce((acc, r) => acc * r, 1);


        return {
            result: volume*mean,
            variance: varianceValue,
            error: volume * (standarDesviation / Math.sqrt(dim))
        };
    }
};
