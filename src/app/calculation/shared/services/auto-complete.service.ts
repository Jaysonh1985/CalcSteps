import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
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
}
