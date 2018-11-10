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
    const date = moment(InputValue, "DD/MM/YYYY", true);
    if (date.isValid() === false) {
      let filterArray = [];
      filterArray = array.filter(x => x.data === "Date" && x.name === InputValue);
      return filterArray[filterArray.length - 1].output;
    } else {
      return InputValue;
    }
  }

  getNumber(InputValue, array): any {
    if (isNaN(Number(InputValue))) {
      let filterArray = [];
      filterArray = array.filter(x => x.data === "Number" && x.name === InputValue);
      if (isNaN(Number(filterArray[filterArray.length - 1].output))) {
        return 0;
      }
      return filterArray[filterArray.length - 1].output;
    } else {
      return InputValue;
    }
  }

  getText(InputValue, array): any {
    let filterArray = [];
    filterArray = array.filter(x => x.data === "Text" && x.name === InputValue);
    return filterArray[filterArray.length - 1].output;
  }

  getLogic(InputValue, array): any {
    let input = false;
    if (InputValue !== "true" && InputValue !== "false") {
      input = InputValue;
      let filterArray = [];
      filterArray = array.filter(x => x.data === "Logic" && x.name === InputValue);
      if (filterArray[filterArray.length - 1].output === "") {
        return false;
      }
      return filterArray[filterArray.length - 1].output;
    } else {
      return InputValue;
    }
  }

  getNumberError(InputValue, array): any {
    if (isNaN(Number(InputValue))) {
      let filterArray = [];
      filterArray = array.filter(x => x.data === "Number" && x.name === InputValue);
      if (isNaN(Number(filterArray[filterArray.length - 1].output))) {
        return filterArray[filterArray.length - 1].output;
      }
      if (filterArray[filterArray.length - 1].output === "") {
        return 0;
      }
      return filterArray[filterArray.length - 1].output;
    } else {
      return InputValue;
    }
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
