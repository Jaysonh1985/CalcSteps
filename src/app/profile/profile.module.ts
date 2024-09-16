import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";
import { RouteModule } from "../app.router";
import { MaterialModule } from "../material.module";
import { AccountComponent } from "./account/account.component";
import { LoginComponent } from "./login/login.component";
import { PaymentsService } from "./payments/payments.service";
import { SubscriptionPaymentComponent } from "./payments/subscription-payment/subscription-payment.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthService } from "../shared/services/auth.service";
import { SharedModule } from "../shared/shared.module";
import { UserChargesComponent } from "./payments/user-charges/user-charges.component";
import { UserSourcesComponent } from "./payments/user-sources/user-sources.component";
import { UserSubscriptionsComponent } from "./payments/user-subscriptions/user-subscriptions.component";
import { StripePipe } from "./payments/shared/stripe.pipe";
import { PaymentFormComponent } from "./payments/payment-form/payment-form.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    RouteModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    AccountComponent,
    SubscriptionPaymentComponent,
    UserChargesComponent,
    UserSourcesComponent,
    UserSubscriptionsComponent,
    StripePipe,
    PaymentFormComponent
  ],
  providers: [PaymentsService, AuthService],
  bootstrap: [AppComponent]
})
export class ProfileModule {}
