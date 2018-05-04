import { Maths } from "../../functions/function-maths/function-maths.component";
import { CalculationError } from "./calculation-error";

export class CalculationConfiguration {
  group: string;
  functionType: string;
  name: string;
  data: string;
  output: string;
  maths: Maths[];
  errors: CalculationError[];
}
