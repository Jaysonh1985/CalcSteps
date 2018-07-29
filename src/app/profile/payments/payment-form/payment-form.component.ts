import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { PaymentsService } from "../payments.service";
import { Charge, Source } from "../shared/models";

@Component({
  selector: "app-payment-form",
  templateUrl: "./payment-form.component.html",
  styleUrls: ["./payment-form.component.css"]
})
export class PaymentFormComponent implements AfterViewInit, OnDestroy {
  // Total amount of the charge
  @Input() totalAmount: number;
  @Input() sourceId: any;
  // Emit result of operation to other components
  @Output() stripeResult = new EventEmitter<Charge | Source>();

  // Result used locacally to display status.
  result: Charge | Source;

  // The Stripe Elements Card
  @ViewChild("cardElement") cardElement: ElementRef;
  card: any;
  formError: string;
  formComplete = false;

  // State of async activity
  loading = false;
  error: any;
  status: any;
  amount: any;

  constructor(private cd: ChangeDetectorRef, public pmt: PaymentsService) {}

  ngAfterViewInit() {
    this.card = this.pmt.elements.create("card");
    this.card.mount(this.cardElement.nativeElement);

    // Listens to change event on the card for validation errors
    this.card.on("change", evt => {
      this.formError = evt.error ? evt.error.message : null;
      this.formComplete = evt.complete;
      this.cd.detectChanges();
    });
  }
  // Called when the user submits the form
  formHandler(): void {
    this.loading = true;
    let action;

    if (this.totalAmount) {
      action = this.pmt.createCharge(this.card, this.totalAmount);
    } else {
      action = this.pmt.attachSource(this.card);
    }

    action.subscribe(
      data => {
        this.result = data;
        this.error = data.error;
        this.status = data.status;
        this.amount = data.amount;
        this.card = data.card;
        this.stripeResult.emit(data);
        this.loading = false;
        this.pmt
          .attachSubscription(data.id, "plan_Cwi9mPWRIyMUEp")
          .subscribe(data1 => {
            this.loading = false;
          });
      },
      err => {
        this.result = err;
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    if(this.card) {
      this.card.destroy();
    }
  }
}
