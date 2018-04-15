import { CalculationInput } from "./calculation-input";
import { CalculationOutput } from "./calculation-output";
import { CalculationConfiguration } from "./calculation-configuration";

export class Calculation {
  $key: string;
  function: string;
  group: string;
  name: string;
  owner: string;
  regressionpass: boolean;
  calculationtype: string;
  updatedate: Date = new Date();
  username: string;
  calculationInput: CalculationInput;
  calculationOutput: CalculationOutput;
  calculationConfiguration: CalculationConfiguration;
}
