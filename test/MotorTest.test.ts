import { MonteCarloMotor } from "../src/monteCarlo";
import { Scope, ResultData } from "../src/models/models";
import { compileToNative, NativeFunction } from "../src/parse";

describe('MonteCarloMotor', () => {
    let motor : MonteCarloMotor

    beforeEach(() => {
        motor = new MonteCarloMotor();
    })

    it("Test for N = 1", () => {
        let dim : number = 1_000_000;
        let scope : Scope = {
            variable : "x",
            lowerLimit : 1,
            upperLimit : 5
        }
        let func : string = "(5*x^2+4)/(3*x)";
        let result: ResultData | null = null

        try {
            let functCompiled: NativeFunction = compileToNative(func, [scope.variable]);
            result = motor.monteCarloEvaluationNVar(functCompiled, dim, [scope]);
        } catch (error) {
            console.error("❌ Test 1 failed:", error);
        }
        expect(result).toBeDefined();
        expect(result!.result).toBeGreaterThan(22.1459172165788 - 4*result!.error);
        expect(result!.result).toBeLessThan(22.1459172165788 + 4*result!.error);
    });

    it("Test for N = 2", () => {
        let dim : number = 1_000_000;
        let scopes : Scope[] = [
            {variable : "x", lowerLimit : 5, upperLimit : 10},
            {variable : "y", lowerLimit : 1, upperLimit : 6}
        ]
        let func : string = "(5*x^2*y+4)/(3*x*y^3)";
        let result : ResultData | null = null;

        try{
            let functCompiled : NativeFunction = compileToNative(func, scopes.map(s => s.variable));
            result = motor.monteCarloEvaluationNVar(functCompiled, dim, scopes);
        }catch(error) {
            console.error("❌ Test 2 failed:", error);
        }
        expect(result).toBeDefined();
        expect(result!.result).toBeGreaterThan(52.532595394807 - 4*result!.error);
        expect(result!.result).toBeLessThan(52.532595394807 + 4*result!.error);
    })

    it("Test for N = 10", () => {
        let dim: number = 1_000_000;

        let scopes: Scope[] = [
            { variable: "x1", lowerLimit: 1,  upperLimit: 5  },
            { variable: "x2", lowerLimit: 2,  upperLimit: 6  },
            { variable: "x3", lowerLimit: 0,  upperLimit: 4  },
            { variable: "x4", lowerLimit: 3,  upperLimit: 7  },
            { variable: "x5", lowerLimit: 1,  upperLimit: 3  },
            { variable: "x6", lowerLimit: 2,  upperLimit: 8  },
            { variable: "x7", lowerLimit: 0,  upperLimit: 5  },
            { variable: "x8", lowerLimit: 1,  upperLimit: 9  },
            { variable: "x9", lowerLimit: 4,  upperLimit: 10 },
            { variable: "x10", lowerLimit: 2, upperLimit: 7  },
        ];

        let func: string = "x1^2 + x2^3 + x3^2 + x4^2 + x5^2 + x6^2 + x7^2 + x8^3 + x9^2 + x10^3";
        let result: ResultData | null = null;
        try {
            let functCompiled: NativeFunction = compileToNative(func, scopes.map(s => s.variable));
            result = motor.monteCarloEvaluationNVar(functCompiled, dim, scopes);
        }catch(error) {
            console.error("❌ Test 3 failed:", error);
        }
        expect(result).toBeDefined();
        expect(result!.result).toBeGreaterThan(1_986_662_400 - 4*result!.error);
        expect(result!.result).toBeLessThan(1_986_662_400 + 4*result!.error);
    });
})