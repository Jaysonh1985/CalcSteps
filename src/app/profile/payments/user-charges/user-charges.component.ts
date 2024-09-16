import { Component, OnInit } from "@angular/core";
import { Charge } from "../shared/models";
import { Observable } from "rxjs";
import { PaymentsService } from "../payments.service";

@Component({
  selector: "app-user-charges",
  templateUrl: "./user-charges.component.html",
  styleUrls: ["./user-charges.component.css"]
})
export class UserChargesComponent implements OnInit {
  charges$: Observable<Charge[]>;
  constructor(public pmt: PaymentsService) {}

  ngOnInit() {
    this.charges$ = this.pmt.getCharges();
  }
}
