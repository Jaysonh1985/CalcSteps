import { CalculationConfiguration } from "./calculation-configuration";
import { CalculationInput } from "./calculation-input";
import { CalculationOutput } from "./calculation-output";

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
  userid: string;
  calculationInputs: CalculationInput[];
  calculationOutputs: CalculationOutput[];
  calculationConfigurations: CalculationConfiguration[];
}
