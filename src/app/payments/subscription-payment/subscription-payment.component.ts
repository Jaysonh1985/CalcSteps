import { Component, OnInit } from "@angular/core";
import { PaymentsService } from "../payments.service";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-subscription-payment",
  templateUrl: "./subscription-payment.component.html",
  styleUrls: ["./subscription-payment.component.css"]
})
export class SubscriptionPaymentComponent implements OnInit {
  handler: any;
  status: string;
  uid: string;
  constructor(public pmt: PaymentsService, private authServices: AuthService) {
    this.authServices.userFirebase.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
      }
    });
    status = "";
  }

  ngOnInit() {
    this.configHandler();
    this.authServices.userFirebase.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.pmt
        .getMembershipStatus(auth.uid)
        .snapshotChanges()
        .map( changes => {
          return changes.payload.val();
        })
        .subscribe(stat => {
          this.status = stat;
        });
      }
    });
  }
  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: "https://goo.gl/EJJYq8",
      locale: "auto",
      token: token => {
        this.pmt.processPayment(token);
      }
    });
  }
  openHandler() {
    this.handler.open({
      name: "Calc-Steps",
      excerpt: "Enterprise Subscription",
      amount: 1500
    });
  }
}
