export class CalculationError {
  index: string;
  type: string;
  errorText: string;
  constructor(index, type, errorText) {
    this.index = index;
    this.type = type;
    this.errorText = errorText;
  }
}
