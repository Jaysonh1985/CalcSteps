export class CalculationOutput {
  name: string;
  data: string;
  variable: string;
  output: string;
  eresult: string;
  pass: boolean;
  constructor(name, data, output, variable, eresult, pass) {
    this.name = name;
    this.data = data;
    this.variable = variable;
    this.output = output;
    this.eresult = eresult;
    this.pass = pass;
  }
}
