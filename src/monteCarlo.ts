import { evaluate, number, random } from "mathjs";
import { EvalFunction } from "mathjs";
import { Scope, ResultData, VariableSample } from "./models/models";


export class MonteCarloMotor {
    public monteCarloEvaluationNVar(functCompiled : EvalFunction, dim : number, scope : Scope[]) : ResultData{

    if(dim<1) throw Error("Dimension is not valid");
    if(!scope || scope.length == 0) throw Error("Scope is not valid");
    scope.forEach( s => {
        if (s.lim_inf >= s.lim_sup) {
            throw new Error(`Limits of variable: ${s.variable} are inconsistent`);
        }
    })
    
    let randomValues : VariableSample[] = this.generateRandomValuesInRange(scope, dim);

    let sumOfPoints : number = 0;
    let sumOfSquares : number = 0;

    for (let i = 0; i < dim; i++) {
        const z = functCompiled.evaluate(this.RandomNumbersAdaptater(randomValues, i));
        sumOfPoints += z;
        sumOfSquares += (z * z);
    }

    let mean : number = sumOfPoints / dim;
    let meanOfSquares : number = sumOfSquares / dim;

    let varianceValue : number = Math.max(0, meanOfSquares - (mean * mean));
    let standarDesviation : number = Math.sqrt(varianceValue);

    let volume : number = scope.reduce((acc, s) => acc * (s.lim_sup - s.lim_inf), 1);


    return {
        result: volume*mean,
        variance: varianceValue,
        error: volume * (standarDesviation / Math.sqrt(dim))
    };
}

    private generateRandomValuesInRange(scope : Scope[], dim : number) : VariableSample[] {
        let randomList : VariableSample[] = [];

        scope.forEach(element => {
            randomList.push({ variable : element.variable, randomValues : []})
        });

        let randomValue : number;

        for(let i : number = 0;i<dim;i++){
            for(let j : number = 0;j<scope.length;j++) {
                randomValue= Math.random() * (scope[j].lim_sup-scope[j].lim_inf) + scope[j].lim_inf;
                randomList[j].randomValues.push(randomValue)
            }
        }
        return randomList;
    };

    private RandomNumbersAdaptater(randomValues : VariableSample[], index : number) : Record<string, number> {
        let randomValuesAdapted : Record<string, number> = {};

        randomValues.forEach(element => {
            randomValuesAdapted[element.variable] = element.randomValues[index]
        });
        return randomValuesAdapted;
    };
};


