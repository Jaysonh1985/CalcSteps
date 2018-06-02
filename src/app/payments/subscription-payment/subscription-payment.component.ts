import { Component, OnInit } from "@angular/core";
import { PaymentsService } from "../payments.service";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../services/auth.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-subscription-payment",
  templateUrl: "./subscription-payment.component.html",
  styleUrls: ["./subscription-payment.component.css"]
})
export class SubscriptionPaymentComponent implements OnInit {
  handler: any;
  updateHandler: any;
  status: string;
  uid: string;
  email: string;
  constructor(
    public pmt: PaymentsService,
    private authServices: AuthService,
    public dialog: MatDialog
  ) {
    this.authServices.userFirebase.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.email = auth.email;
      }
    });
    status = "";
  }

  ngOnInit() {
    this.configHandler();
    this.authServices.userFirebase.subscribe(auth => {
      if (auth) {
        this.uid = auth.uid;
        this.status = "";
        this.pmt
          .getMembershipStatus(auth.uid)
          .snapshotChanges()
          .map(changes => {
            return changes.payload.val();
          })
          .subscribe(stat => {
            if (stat != null) {
              this.status = stat;
            }
          });
      }
    });
  }
  private configHandler() {
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: "https://stripe.com/img/documentation/checkout/marketplace.png",
      locale: "auto",
      currency: "gbp",
      name: "calc-steps",
      description: "Enterprise Subscription",
      amount: 1500,
      token: token => {
        this.pmt.processPayment(token);
      }
    });
  }
  openHandler() {
    this.handler.open({ email: this.email });
  }
  onUnsubscribe() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "400px",
      data: {
        description:
          "Do you wish to unsubscribe, this will take effect immediately?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.pmt.setStatus("cancelled");
      }
    });
  }
}
