import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import "moment/locale/pt-br";
import * as moment from "moment";

@Injectable()
export class AutoCompleteService {
  private autocomplete = new BehaviorSubject<any[]>([]);
  cast = this.autocomplete.asObservable();
  constructor() {}

  editAutocomplete(newAutocomplete) {
    this.autocomplete.next(newAutocomplete);
  }

  addAutoComplete(newAutocomplete) {
    this.autocomplete.subscribe(current => {
      this.autocomplete.getValue().push(newAutocomplete);
    });
  }

  getDate(InputValue, array): any {
    let input = 0;
    const date = moment(InputValue, "DD/MM/YYYY", true);
    if (date.isValid() === false) {
      input = InputValue;
      array.forEach(value => {
        if (value.name === InputValue && value.data === "Date") {
          input = value.output;
        }
      });
    } else {
      input = InputValue;
    }
    return input;
  }

  getNumber(InputValue, array): any {
    let input = 0;
    if (isNaN(Number(InputValue))) {
      input = InputValue;
      array.forEach(value => {
        if (value.name === InputValue && value.data === "Number") {
          input = value.output;
        }
      });
      if (isNaN(Number(input))) {
        input = 0;
      }
    } else {
      input = InputValue;
    }
    return input;
  }

  getText(InputValue, array): any {
    let input = InputValue;
    array.forEach(value => {
      if (value.name === InputValue && value.data === "Text") {
        input = value.output;
      }
    });
    return input;
  }

  getLogic(InputValue, array): any {
    let input = false;
    if (InputValue !== "true" && InputValue !== "false") {
      input = InputValue;
      array.forEach(value => {
        if (value.name === InputValue && value.data === "Logic") {
          if (value.output === "") {
            input = false;
          } else {
            input = value.output;
          }
        }
      });
    } else {
      input = InputValue;
    }
    return input;
  }

  getNumberError(InputValue, array): any {
    let input = 0;
    if (isNaN(Number(InputValue))) {
      input = InputValue;
      array.forEach(value => {
        if (value.name === InputValue && value.data === "Number") {
          if (value.output === "") {
            input = 0;
          } else {
            input = value.output;
          }
        }
      });
      if (isNaN(Number(input))) {
        input = input;
      }
    } else {
      input = InputValue;
    }
    return input;
  }

  getAutoCompleteArray(array, datatype): any[] {
    const autoComplete = [];
    array.filter(x => x.data.data === datatype).forEach(element => {
      autoComplete.push({
        name: element.data.name,
        type: "variable",
        datatype: element.data.data,
        value: element.data.output
      });
    });
    return autoComplete;
  }
}
