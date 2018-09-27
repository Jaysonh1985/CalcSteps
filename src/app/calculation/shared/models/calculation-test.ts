import { CalculationInput } from "./calculation-input";
import { CalculationOutput } from "./calculation-output";

export class CalculationTest {
  group: string;
  name: string;
  owner: string;
  updateDate: Date = new Date();
  username: string;
  userid: string;
  pass: boolean;
  calculationInputs: CalculationInput[];
  calculationOutputs: CalculationOutput[];
}
