import { Component, OnInit } from "@angular/core";
import { PaymentsService } from "../payments.service";
import { switchMap, tap, map } from "rxjs/operators";
import { AuthService } from "../../../shared/services/auth.service";
import { Observable } from "rxjs/Observable";
import { SubscriptionPlan } from "../shared/models";

@Component({
  selector: "app-user-subscriptions",
  templateUrl: "./user-subscriptions.component.html",
  styleUrls: ["./user-subscriptions.component.css"]
})
export class UserSubscriptionsComponent implements OnInit {
  subscriptions$: Observable<any>;
  constructor(public pmt: PaymentsService, public auth: AuthService) {}

  ngOnInit() {
    this.subscriptions$ = this.pmt.getCustomer().map(user => user.subscriptions.data);
  }
}
