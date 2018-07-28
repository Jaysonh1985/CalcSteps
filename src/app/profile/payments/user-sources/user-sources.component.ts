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
  customers: any;
  @Input() canSelect: boolean;
  @Output() selectedSource = new EventEmitter<Source>();
  constructor(private pmt: PaymentsService) {}

  async ngOnInit() {
    await this.pmt.getCustomer().subscribe(user => {
      if (user) {
        this.customers = user.sources;
      } else {
        this.customers = null;
      }
    });
  }

  clickHandler(source: Source) {
    this.selectedSource.emit(source);
  }
}
