import { CalculationError } from "./calculation-error";

export class CalculationOutput {
  id: string;
  name: string;
  data: string;
  variable: string;
  output: string;
  eresult: string;
  pass: boolean;
  errors: CalculationError[];
  constructor(id, name, data, output, variable, eresult, pass, errors) {
    this.id = id;
    this.name = name;
    this.data = data;
    this.variable = variable;
    this.output = output;
    this.eresult = eresult;
    this.pass = pass;
    this.errors = errors;
  }
}
