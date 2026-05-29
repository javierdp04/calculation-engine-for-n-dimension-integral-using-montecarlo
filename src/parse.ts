import { compile, parse, MathNode } from 'mathjs'
import { EvalFunction } from "mathjs";

export function compileExpresion(stringExpresion : string) : EvalFunction {
    return compile(stringExpresion)
}

export type NativeFunction = (...args : number[]) => number;


const BINARY_OP : Record<string, string> = {
    "+": "+", "-": "-", "*": "*", "/": "/", "%": "%",
};


const FUNCTIONS : Record<string, string> = {
    sqrt: "Math.sqrt", cbrt: "Math.cbrt", abs: "Math.abs",
    sin: "Math.sin", cos: "Math.cos", tan: "Math.tan",
    asin: "Math.asin", acos: "Math.acos", atan: "Math.atan", atan2: "Math.atan2",
    sinh: "Math.sinh", cosh: "Math.cosh", tanh: "Math.tanh",
    log: "Math.log", log2: "Math.log2", log10: "Math.log10",
    exp: "Math.exp", pow: "Math.pow", sign: "Math.sign",
    floor: "Math.floor", ceil: "Math.ceil", round: "Math.round",
    min: "Math.min", max: "Math.max",
};


const CONSTANTS : Record<string, string> = {
    pi: "Math.PI", e: "Math.E", tau: "(2*Math.PI)",
};

function gen(node : MathNode, variables : Set<string>) : string {
    switch (node.type) {
        case "ConstantNode":
            return String((node as any).value);

        case "SymbolNode": {
            const name = (node as any).name;
            if (CONSTANTS[name] !== undefined) return CONSTANTS[name];
            if (!variables.has(name)) {
                throw new Error(`Variable no declarada en el scope: ${name}`);
            }
            return name;
        }

        case "ParenthesisNode":
            return `(${gen((node as any).content, variables)})`;

        case "OperatorNode": {
            const { op, args } = node as any;


            if (args.length === 1) return `(${op}${gen(args[0], variables)})`;

            
            if (op === "^") {
                return `Math.pow(${gen(args[0], variables)}, ${gen(args[1], variables)})`;
            }

            const jsOp = BINARY_OP[op];
            if (jsOp === undefined) throw new Error(`Operador no soportado: ${op}`);
            return `(${gen(args[0], variables)} ${jsOp} ${gen(args[1], variables)})`;
        }

        case "FunctionNode": {
            const name = (node as any).fn.name;
            const jsFn = FUNCTIONS[name];
            if (jsFn === undefined) throw new Error(`Funcion no soportada: ${name}`);
            const inner = (node as any).args.map((a : MathNode) => gen(a, variables)).join(", ");
            return `${jsFn}(${inner})`;
        }

        default:
            throw new Error(`Nodo no soportado: ${node.type}`);
    }
}


export function compileToNative(stringExpresion : string, variables : string[]) : NativeFunction {
    const tree = parse(stringExpresion);
    const body = gen(tree, new Set(variables));
    return new Function(...variables, `return ${body};`) as NativeFunction;
}
