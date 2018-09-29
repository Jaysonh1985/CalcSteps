export class CalculationOutput {
  id: string;
  name: string;
  data: string;
  variable: string;
  output: string;
  eresult: string;
  pass: boolean;
  constructor(id, name, data, output, variable, eresult, pass) {
    this.id = id;
    this.name = name;
    this.data = data;
    this.variable = variable;
    this.output = output;
    this.eresult = eresult;
    this.pass = pass;
  }
}
