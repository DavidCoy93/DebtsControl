import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import { CookieItem } from '../models/cookie-item';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../components/dialog-box/dialog-box.component';
import { DialogBoxItem } from '../models/dialog-box-item';


interface FormLogin {
  User: FormControl<string>,
  Pwd: FormControl<string>,
  Remember: FormControl<boolean>
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {


  constructor(
    private _commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    if (localStorage.getItem("Remember") === null) {
      localStorage.setItem("Remember", "false");
    }

    const rememberMeStr = localStorage.getItem("Remember") || "";
    const rememberMe: boolean = (rememberMeStr === "true") ? true : false;
    this.controls.Remember.setValue(rememberMe, {onlySelf: true});
  }

  ngOnInit(): void {
    if (this.controls.Remember.value) {
      let storedCookies: Array<CookieItem> = this._commonService.getCookies("usr", "pwd");
      if (storedCookies.length > 0) {
        this.LoginForm.patchValue(
          {
            User: storedCookies[0].value,
            Pwd: storedCookies[1].value
          }
        ) 
      }
    }
  }

  LoginForm: FormGroup<FormLogin> = new FormGroup<FormLogin>(
    {
      User: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
      Pwd: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
      Remember: new FormControl<boolean>(false, {nonNullable: true})
    }
  )


  get controls() { return this.LoginForm.controls }


  submitForm(): void {

    if (this.LoginForm.valid) {
      if (this.controls.User.value === "spiterman" && this.controls.Pwd.value === "caguamitas") {
        if (this.controls.Remember.value) {
          const credentials: Array<CookieItem> = [ 
            { propName: "usr", value: this.controls.User.value, expirationHours: 12 },
            { propName: "pwd", value: this.controls.Pwd.value, expirationHours: 12 }
          ]
          this._commonService.createACookie(credentials);
        }
        this.router.navigate(['/', 'home'])
      } else {
        this.dialog.open<DialogBoxComponent, DialogBoxItem, boolean>(DialogBoxComponent,
          {
            data: { Title: "Vayase a la verga culero", Message: "Usted no es el pendejo de coy", Type: 'error' },
            width: '300px',
            height: '200px',
            hasBackdrop: true,
            disableClose: true
          }
        )
      }
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }

  remembermeChange(eventChange: MatCheckboxChange): void {
    localStorage.setItem("Remember", (eventChange.checked) ? "true" : "false");
    
    if (!eventChange.checked && document.cookie.includes("usr") && document.cookie.includes("pwd")) {
      const credentials: Array<CookieItem> = [ 
        { propName: "usr", value: this.controls.User.value, expirationHours: -12 },
        { propName: "pwd", value: this.controls.Pwd.value, expirationHours: -12 }
      ]
      this._commonService.createACookie(credentials);
    }
  }
}
