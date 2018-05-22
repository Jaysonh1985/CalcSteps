export class CalculationOutput {
  name: string;
  data: string;
  variable: string;
  output: string;
  constructor(name, data, output, variable) {
    this.name = name;
    this.data = data;
    this.variable = variable;
    this.output = output;
  }
}
