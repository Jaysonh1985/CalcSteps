import { map, switchMap, tap } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { PaymentsService } from "../payments.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Observable } from "rxjs";
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
    this.subscriptions$ = this.pmt
      .getCustomer()
      .pipe(map(user => user.subscriptions.data));
  }
}
