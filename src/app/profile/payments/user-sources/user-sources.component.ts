import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { PaymentsService } from "../payments.service";
import { Source, Customer, StripeObject } from "../shared/models";

@Component({
  selector: "app-user-sources",
  templateUrl: "./user-sources.component.html",
  styleUrls: ["./user-sources.component.css"]
})
export class UserSourcesComponent implements OnInit {
  customer$: Observable<Customer>;
  @Input() canSelect: boolean;
  @Output() selectedSource = new EventEmitter<Source>();
  constructor(private pmt: PaymentsService) {}

  ngOnInit() {
    this.customer$ = this.pmt.getCustomer();
  }

  clickHandler(source: Source) {
    this.selectedSource.emit(source);
  }
}
