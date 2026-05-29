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
            lim_inf : 1,
            lim_sup : 5
        }
        let funct : string = "(5*x^2+4)/(3*x)";
        let result: ResultData | null = null

        try {
            let functCompiled: NativeFunction = compileToNative(funct, [scope.variable]);
            result = motor.monteCarloEvaluationNVar(functCompiled, dim, [scope]);
        } catch (error) {
            console.error("❌ Test 1 fallido:", error);
        }
        expect(result).toBeDefined();
        expect(result!.result).toBeGreaterThan(22.1459172165788 - 4*result!.error);
        expect(result!.result).toBeLessThan(22.1459172165788 + 4*result!.error);
    });

    it("Test for N = 2", () => {
        let dim : number = 1_000_000;
        let scopes : Scope[] = [
            {variable : "x", lim_inf : 5, lim_sup : 10},
            {variable : "y", lim_inf : 1, lim_sup : 6}
        ]
        let funct : string = "(5*x^2*y+4)/(3*x*y^3)";
        let result : ResultData | null = null;

        try{
            let functCompiled : NativeFunction = compileToNative(funct, scopes.map(s => s.variable));
            result = motor.monteCarloEvaluationNVar(functCompiled, dim, scopes);
        }catch(error) {
            console.error("❌ Test 2 fallido:", error);
        }
        expect(result).toBeDefined();
        expect(result!.result).toBeGreaterThan(52.532595394807 - 4*result!.error);
        expect(result!.result).toBeLessThan(52.532595394807 + 4*result!.error);
    })

    it("Test for N = 10", () => {
        let dim: number = 1_000_000;

        let scopes: Scope[] = [
            { variable: "x1", lim_inf: 1,  lim_sup: 5  },
            { variable: "x2", lim_inf: 2,  lim_sup: 6  },
            { variable: "x3", lim_inf: 0,  lim_sup: 4  },
            { variable: "x4", lim_inf: 3,  lim_sup: 7  },
            { variable: "x5", lim_inf: 1,  lim_sup: 3  },
            { variable: "x6", lim_inf: 2,  lim_sup: 8  },
            { variable: "x7", lim_inf: 0,  lim_sup: 5  },
            { variable: "x8", lim_inf: 1,  lim_sup: 9  },
            { variable: "x9", lim_inf: 4,  lim_sup: 10 },
            { variable: "x10", lim_inf: 2, lim_sup: 7  },
        ];

        let funct: string = "x1^2 + x2^3 + x3^2 + x4^2 + x5^2 + x6^2 + x7^2 + x8^3 + x9^2 + x10^3";
        let result: ResultData | null = null;
        try {
            let functCompiled: NativeFunction = compileToNative(funct, scopes.map(s => s.variable));
            result = motor.monteCarloEvaluationNVar(functCompiled, dim, scopes);
        }catch(error) {
            console.error("❌ Test 3 fallido:", error);
        }
        expect(result).toBeDefined();
        expect(result!.result).toBeGreaterThan(1_986_662_400 - 4*result!.error);
        expect(result!.result).toBeLessThan(1_986_662_400 + 4*result!.error);
    });
})