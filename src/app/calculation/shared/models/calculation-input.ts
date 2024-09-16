import { CalculationError } from "./calculation-error";

export class CalculationInput {
  id: string;
  name: string;
  data: string;
  output: string;
  errors: CalculationError[];
  dropDownList: string;
  dropDownValues: string;
  required: string;
  constructor(id, name, data, output, errors, dropDownList, required) {
    this.id = id;
    this.name = name;
    this.data = data;
    this.output = output;
    this.errors = errors;
    this.dropDownList = dropDownList;
    this.required = required;
  }
}
