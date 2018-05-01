import { CalculationInput } from "./calculation-input";
import { CalculationOutput } from "./calculation-output";
import { CalculationConfiguration } from "./calculation-configuration";

export class Calculation {
  $key: string;
  function: string;
  group: string;
  name: string;
  owner: string;
  regression: boolean;
  calculationType: string;
  updateDate: Date = new Date();
  username: string;
  calculationInputs: CalculationInput[];
  calculationOutputs: CalculationOutput[];
  calculationConfigurations: CalculationConfiguration[];
}
