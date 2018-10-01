import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material";

import { environment } from "../../../../environments/environment";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "../../../shared/services/auth.service";
import { PaymentsService } from "../payments.service";

@Component({
  selector: "app-subscription-payment",
  templateUrl: "./subscription-payment.component.html",
  styleUrls: ["./subscription-payment.component.css"]
})
export class SubscriptionPaymentComponent implements OnInit {
  handler: any;
  updateHandler: any;
  subscriptionStatus: any;
  uid: string;
  email: string;
  loading: boolean;
  subscriptionTypes: string[] = ["Gold", "Enterprise"];
  subscriptionType: string;
  @Input()
  planId: string;
  @Input()
  sourceId: string;

  constructor(
    public pmt: PaymentsService,
    public authServices: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authServices.userFirebase.subscribe(auth => {
      this.subscriptionStatus = null;
      if (auth) {
        this.uid = auth.uid;
        this.pmt
          .getSubscriptions(auth.uid)
          .snapshotChanges()
          .map(changes => {
            return changes.payload.val();
          })
          .subscribe(sub => {
            if (sub != null) {
              this.subscriptionStatus = sub.status;
            }
          });
      }
    });
  }

  cancelHandler() {
    this.loading = true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "400px",
      data: {
        description:
          "Do you wish to unsubscribe, this will take effect on your next billing date?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.pmt.cancelSubscription(this.planId).subscribe(data => {
          this.loading = false;
        });
      }
    });
  }
}
