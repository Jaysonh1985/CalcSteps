import { map } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Calculation } from "../shared/models/calculation";
import { Release } from "../shared/models/release";
import { CalculationService } from "../shared/services/calculation.service";
import { ReleaseService } from "../shared/services/release.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-release-management",
  templateUrl: "./release-management.component.html",
  styleUrls: ["./release-management.component.css"]
})
export class ReleaseManagementComponent implements OnInit {
  public releases: any;
  public release: Release = null;
  public calculation: Calculation = null;
  public releaseKey: string;
  constructor(
    public releaseService: ReleaseService,
    private route: ActivatedRoute,
    private calcService: CalculationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.releaseService
      .getReleaseListbycalculationKey(this.route.snapshot.params["key"])
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        })
      )
      .subscribe(customers => {
        this.releases = customers;
      });
  }
  public onRelease() {
    this.calcService
      .getCalculation(this.route.snapshot.params["key"])
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        })
      )
      .subscribe(releases => this.createRelease(releases, "New"));
  }
  createRelease(release, comment) {
    this.updateVersion();
    delete release[0].key;
    this.release = release[0];
    this.release.calculationKey = this.route.snapshot.params["key"];
    this.release.currentVersion = true;
    this.release.isAvailable = true;
    this.release.comment = comment;
    this.releaseService.createRelease(this.release);
  }
  updateVersion() {
    this.releases.forEach(element => {
      element.currentVersion = false;
      element.comment = "Previous Version";
      this.releaseService.updateRelease(element.key, element);
    });
  }
  onRevertVersion(release) {
    this.releaseService
      .getRelease(release.key)
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        })
      )
      .subscribe(releases => {
        this.createRelease(releases, "Rollback to " + release.key);
      });
  }
  onDeleteVersion(release) {
    release.currentVersion = false;
    release.isAvailable = false;
    this.releaseService.updateRelease(release.key, release);
  }
  routerCalculation(calculation) {
    this.router.navigate(["calculation", this.route.snapshot.params["key"]]);
  }
}
