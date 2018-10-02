import { Component, OnInit } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFireDatabase } from "angularfire2/database";
import { CalculationService } from "../shared/services/calculation.service";
import { MatDialog } from "@angular/material";
import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { PaymentsService } from "../../profile/payments/payments.service";

@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"]
})
export class UserManagementComponent implements OnInit {
  subscriptionStatus: any;
  subscriptionId: any;
  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private calcService: CalculationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public paymentService: PaymentsService
  ) {}
  public users: any[];
  public calculation: any;
  userForm: FormGroup;
  public userExists: boolean;
  ngOnInit() {
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
    this.calcService
      .getCalculation(this.route.snapshot.params["key"])
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      })
      .subscribe(calculations => {
        this.calculation = calculations[0];
        this.users = calculations[0].users;
        this.paymentService
          .getSubscriptions(this.calculation.userid)
          .snapshotChanges()
          .map(changes => {
            return changes.payload.val();
          })
          .subscribe(sub => {
            if (sub != null) {
              this.subscriptionStatus = sub.status;
              if (sub.productId === "plan_DhxNzHjW9CQbZG") {
                this.subscriptionId = "Gold";
              }
              if (sub.productId === "plan_DhqyWHUScOFd9e") {
                this.subscriptionId = "Enterprise";
              }
            }
          });
      });
  }

  addUser(form) {
    if (this.subscriptionStatus === "active") {
      let isEligble: boolean;
      isEligble = false;
      if (
        this.subscriptionId === "Gold" &&
        this.calculation.users.length <= 10
      ) {
        isEligble = true;
      }
      if (this.subscriptionId === "Enterprise") {
        isEligble = true;
      }
      if (isEligble === true) {
        return this.db
          .list("/users", ref => ref.orderByChild("email").equalTo(form.email))
          .snapshotChanges()
          .map(arr => {
            return arr.map(c => ({
              key: c.payload.key,
              email: "",
              name: "",
              ...c.payload.val()
            }));
          })
          .subscribe(releases => {
            if (releases.length === 0) {
              this.userForm.controls["email"].setErrors({
                userDoesNotExists: true
              });
              return null;
            }
            this.userExists = false;
            if (this.users) {
              this.users.forEach(element => {
                if (element.email === this.userForm.controls["email"].value) {
                  this.userExists = true;
                  this.userForm.controls["email"].setErrors({
                    userInList: true
                  });
                  return null;
                }
              });
            }
            if (this.userExists === false) {
              if (!this.calculation.users) {
                this.calculation.users = [];
              }
              this.calculation.users.push({
                email: releases[0].email,
                name: releases[0].name,
                uid: releases[0].key
              });
              this.calcService.updateCalculation(
                this.route.snapshot.params["key"],
                this.calculation
              );
            }
          });
      } else {
        this.userForm.controls["email"].setErrors({
          isNotEligble: true
        });
      }
    }
  }
  deleteUser(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "400px",
      data: { description: "Do you wish to delete user?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.calculation[0].users.splice(index, 1);
        this.calcService.updateCalculation(
          this.route.snapshot.params["key"],
          this.calculation[0]
        );
      }
    });
  }
  routerCalculation(calculation) {
    this.router.navigate(["calculation", this.route.snapshot.params["key"]]);
  }
  get email() {
    return this.userForm.get("email");
  }
  getEmailErrorMessage() {
    return this.userForm.controls["email"].hasError("required")
      ? "You must enter a value"
      : this.userForm.controls["email"].hasError("email")
        ? "Not a valid email"
        : this.userForm.controls["email"].hasError("userDoesNotExists")
          ? "User does not exist"
          : this.userForm.controls["email"].hasError("userInList")
            ? "User already added"
            : this.userForm.controls["email"].hasError("isNotEligble")
              ? "You do not have the ability to add any further users"
              : "";
  }
}
