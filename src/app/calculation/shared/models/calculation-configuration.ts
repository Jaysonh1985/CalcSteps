import { DateAdjustment } from "../../functions/function-date-adjustment/function-date-adjustment.component";
import { DateDuration } from "../../functions/function-date-duration/function-date-duration.component";
import { Distance } from "../../functions/function-distance/function-distance.component";
import { IfLogic } from "../../functions/function-if-logic/function-if-logic.component";
import { LookupTable } from "../../functions/function-lookup-table/function-lookup-table.component";
import { Maths } from "../../functions/function-maths/function-maths.component";
import { CalculationError } from "./calculation-error";

export class CalculationConfiguration {
  group: string;
  functionType: string;
  name: string;
  data: string;
  output: string;
  maths: Maths[];
  dateAdjustment: DateAdjustment;
  dateDuration: DateDuration;
  distance: Distance;
  ifLogic: IfLogic[];
  errors: CalculationError[];
  lookupTable: LookupTable;
  condition: string;
  conditionResult: boolean;
  constructor(
    group,
    functionType,
    name,
    data,
    output,
    maths,
    dateAdjustment,
    dateDuration,
    distance,
    ifLogic,
    errors,
    lookupTable,
    condition,
    conditionResult
  ) {
    this.group = group;
    this.functionType = functionType;
    this.name = name;
    this.data = data;
    this.output = output;
    this.maths = maths;
    this.dateAdjustment = dateAdjustment;
    this.dateDuration = dateDuration;
    this.distance = distance;
    this.ifLogic = ifLogic;
    this.errors = errors;
    this.lookupTable = lookupTable;
    this.condition = condition;
    this.conditionResult = conditionResult;
  }
}
