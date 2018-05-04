import { CalculationError } from "./calculation-error";

export class CalculationInput {
  id: string;
  name: string;
  data: string;
  output: string;
  errors: CalculationError[];
}
