import { CalculationConfiguration } from "./calculation-configuration";
import { CalculationInput } from "./calculation-input";
import { CalculationOutput } from "./calculation-output";
import { CalculationTest } from "./calculation-test";

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
  users: any[];
  calculationInputs: CalculationInput[];
  calculationOutputs: CalculationOutput[];
  calculationConfigurations: CalculationConfiguration[];
  calculationTests: CalculationTest[];
}
