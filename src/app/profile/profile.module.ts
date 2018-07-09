import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountComponent } from "../profile/account/account.component";
import { LoginComponent } from "../profile/login/login.component";
import { PaymentsService } from "../profile/payments/payments.service";
import { SubscriptionPaymentComponent } from "../profile/payments/subscription-payment/subscription-payment.component";
import { SignupComponent } from "../profile/signup/signup.component";
import {
  FormsModule,
  ReactiveFormsModule
} from "../../../node_modules/@angular/forms";
import { MaterialModule } from "../material.module";
import { AppComponent } from "../app.component";
import { routes } from "../app.router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AuthService } from "../services/auth.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    routes
  ],
  declarations: [
    LoginComponent,
    SignupComponent,
    AccountComponent,
    SubscriptionPaymentComponent
  ],
  providers: [PaymentsService, AuthService],
  bootstrap: [AppComponent]
})
export class ProfileModule {}
