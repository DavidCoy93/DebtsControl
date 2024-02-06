import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


interface FormLogin {
  User: FormControl<string>,
  Pwd: FormControl<string>
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {


  LoginForm: FormGroup<FormLogin> = new FormGroup<FormLogin>(
    {
      User: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
      Pwd: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] })
    }
  )


  get controls() { return this.LoginForm.controls }


  submitForm(): void {

    if (this.LoginForm.valid) {
      
      if (this.controls.User.value === "spiterman" && this.controls.Pwd.value === "caguamitas") {
        alert("A chingar a su puta madre el Amierdica");
      } else {
        alert("Usted no es el pendejo de coy");
      }
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }
}
