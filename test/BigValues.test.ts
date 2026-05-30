import { MonteCarloMotor } from "../src/monteCarlo";
import { Scope, ResultData } from "../src/models/models";
import { compileToNative, NativeFunction } from "../src/parse";
import { DESTRUCTION } from "node:dns";

describe('BigValues', () => {
    let motor : MonteCarloMotor;

    beforeEach(() => {
        motor = new MonteCarloMotor();
    })

    it("Test for dim = 10_000_000", () => {
        let dim : number = 10_000_000;
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

    it("Test for dim = 100_000_000", () => {
        let dim : number = 100_000_000;
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

    it("Test for dim = 1_000_000_000", () => {
        let dim : number = 1_000_000_000;
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
            console.error("❌ Test 3 failed:", error);
        }
        expect(result).toBeDefined();
        expect(result!.result).toBeGreaterThan(22.1459172165788 - 4*result!.error);
        expect(result!.result).toBeLessThan(22.1459172165788 + 4*result!.error);
    });

    
})