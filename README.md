# calculoIntegrales

A TypeScript library that computes n-dimensional definite integrals using the
Monte Carlo method. It takes a mathematical expression written as a string,
compiles it into a fast native JavaScript function, and estimates the value of
its definite integral over an n-dimensional box (hyperrectangle).

## What it does and how Monte Carlo integration works

A definite integral over a region can be interpreted as the average value of the
integrand over that region multiplied by the volume of the region:

```
I = ∫...∫ f(x1, ..., xn) dx1...dxn  ≈  V · (1/N) · Σ f(P_i)
```

where:

- `V` is the volume of the integration domain (the product of the length of each
  variable's interval).
- `P_i` are `N` random points sampled uniformly inside the domain.
- `f(P_i)` is the integrand evaluated at each random point.

Instead of subdividing the domain into a grid (which becomes intractable as the
number of dimensions grows), Monte Carlo integration draws random samples and
averages them. This makes it especially well suited to high-dimensional
integrals, where grid-based methods suffer from the curse of dimensionality.

In addition to the estimated value, the library reports the variance of the
samples and a statistical estimate of the integration error.

## Project structure

```
calculoIntegrales/
├── src/
│   ├── index.ts             # Public API barrel (re-exports the library)
│   ├── monteCarlo.ts        # MonteCarloMotor: the integration engine
│   ├── parse.ts             # Expression parsing and compilation to native JS
│   └── models/
│       └── models.ts        # Scope and ResultData interfaces
├── test/
│   ├── MotorTest.test.ts    # 1D, 2D and 10D integral tests
│   └── BigValues.test.ts    # High sample-count tests (up to 1e9 samples)
├── jest.config.js
├── tsconfig.json
└── package.json
```

- **`src/parse.ts`** turns a string expression into an executable function using
  [mathjs](https://mathjs.org/) to build the syntax tree and code generation to
  emit a native JavaScript function.
- **`src/monteCarlo.ts`** contains `MonteCarloMotor`, which performs the random
  sampling and aggregates the result.
- **`src/models/models.ts`** defines the `Scope` (integration limits per
  variable) and `ResultData` (output) interfaces.

## Usage example (2D integral)

The following estimates the double integral of `(5*x^2*y + 4) / (3*x*y^3)` over
`x ∈ [5, 10]` and `y ∈ [1, 6]`:

```typescript
import { MonteCarloMotor } from "./src/monteCarlo";
import { compileToNative, NativeFunction } from "./src/parse";
import { Scope, ResultData } from "./src/models/models";

const scopes: Scope[] = [
    { variable: "x", lowerLimit: 5, upperLimit: 10 },
    { variable: "y", lowerLimit: 1, upperLimit: 6 },
];

const expression = "(5*x^2*y+4)/(3*x*y^3)";
const sampleCount = 1_000_000;

// Compile the expression into a native function.
// Variable order must match the order used when sampling.
const compiled: NativeFunction = compileToNative(
    expression,
    scopes.map(s => s.variable)
);

const motor = new MonteCarloMotor();
const result: ResultData = motor.monteCarloEvaluationNVar(
    compiled,
    sampleCount,
    scopes
);

console.log("Estimate:", result.result);
console.log("Variance:", result.variance);
console.log("Error:", result.error);
```

## API reference

### `compileToNative(stringExpression, variables)`

Parses a mathematical expression and compiles it into a native JavaScript
function for fast repeated evaluation.

| Parameter          | Type       | Description                                                         |
| ------------------ | ---------- | ------------------------------------------------------------------- |
| `stringExpression` | `string`   | The mathematical expression to compile (e.g. `"x^2 + sin(y)"`).     |
| `variables`        | `string[]` | The names of the variables the expression depends on, in argument order. |

**Returns:** `NativeFunction` — a function of type `(...args: number[]) => number`.
The arguments are positional and must be passed in the same order as `variables`.

**Throws:** if the expression references an undeclared variable, or uses an
unsupported operator, function, or node type.

### `monteCarloEvaluationNVar(func, dim, scope)`

Estimates the definite integral of `func` over the n-dimensional box described by
`scope` using Monte Carlo sampling.

| Parameter | Type             | Description                                                                 |
| --------- | ---------------- | --------------------------------------------------------------------------- |
| `func`    | `NativeFunction` | The compiled integrand, typically produced by `compileToNative`.            |
| `dim`     | `number`         | The number of random samples (N) to draw. Higher values reduce the error.   |
| `scope`   | `Scope[]`        | One entry per variable, giving its name and integration limits.             |

**Returns:** `ResultData`:

| Field      | Type     | Description                                                  |
| ---------- | -------- | ------------------------------------------------------------ |
| `result`   | `number` | The estimated value of the integral (`volume · mean`).       |
| `variance` | `number` | The variance of the sampled integrand values.                |
| `error`    | `number` | The estimated standard error of the integral estimate.       |

**Throws:** if `dim < 1`, if `scope` is empty, or if any variable's lower limit is
greater than or equal to its upper limit.

> Note: the number of integration dimensions is inferred from the length of the
> `scope` array. The `dim` parameter is the sample count N, not the number of
> dimensions.

### Interfaces

```typescript
interface Scope {
    variable: string;
    lowerLimit: number;
    upperLimit: number;
}

interface ResultData {
    result: number;
    variance: number;
    error: number;
}

type NativeFunction = (...args: number[]) => number;
```

## Supported operators, functions, and constants

### Binary and unary operators

| Operator | Meaning                         |
| -------- | ------------------------------- |
| `+`      | Addition (and unary plus)       |
| `-`      | Subtraction (and unary minus)   |
| `*`      | Multiplication                  |
| `/`      | Division                        |
| `%`      | Modulo                          |
| `^`      | Exponentiation (maps to `pow`)  |

### Functions

| Category      | Functions                                       |
| ------------- | ----------------------------------------------- |
| Roots         | `sqrt`, `cbrt`                                  |
| Absolute/sign | `abs`, `sign`                                   |
| Trigonometric | `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2` |
| Hyperbolic    | `sinh`, `cosh`, `tanh`                          |
| Logarithmic   | `log`, `log2`, `log10`                          |
| Exponential   | `exp`, `pow`                                    |
| Rounding      | `floor`, `ceil`, `round`                        |
| Extrema       | `min`, `max`                                    |

### Constants

| Constant | Value      |
| -------- | ---------- |
| `pi`     | `Math.PI`  |
| `e`      | `Math.E`   |
| `tau`    | `2·Math.PI`|

## Installation and tests

Install dependencies:

```bash
npm install
```

Build the library (compiles `src/` to `dist/` with type declarations):

```bash
npm run build
```

Run the test suite (Jest, via ts-jest):

```bash
npm test
```

The suite is split into two files, both checking that the estimate falls within
four standard errors of the known value:

- **`MotorTest.test.ts`** covers 1-dimensional, 2-dimensional, and
  10-dimensional integrals, each with one million samples.
- **`BigValues.test.ts`** stress-tests convergence on a 1D integral with very
  high sample counts (10 million, 100 million, and 1 billion samples). These
  cases are computationally heavy and demonstrate how the error tightens as the
  sample count grows.

## Accuracy and sample count

Monte Carlo integration is a statistical method: each run draws random samples,
so the result fluctuates between runs. The estimated error reported in
`ResultData.error` is

```
error = V · σ / √N
```

where `V` is the domain volume, `σ` is the standard deviation of the sampled
integrand values, and `N` is the sample count (`dim`).

The key consequence is that the error shrinks as **O(1/√N)**: to halve the error
you must quadruple the number of samples. This convergence rate is independent of
the number of dimensions, which is why Monte Carlo integration scales well to
high-dimensional problems where deterministic grid methods become impractical.

In practice, increasing `dim` improves accuracy with diminishing returns. The
tests in this project use one million samples per integral to obtain tight
bounds.
