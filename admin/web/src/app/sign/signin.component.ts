import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SignService, SignType } from "./sign.service";

@Component({
  selector: 'sign-in',
  templateUrl: "signin.component.html"
})
export class SigninComponent {
  captchaUrl: string = '';
  user:any = {email: localStorage.getItem("last.email") || '', password: ''};
  @Input() options: any;
  saving: boolean;
  @ViewChild('signinForm') currentForm: NgForm;
  constructor(private _signService: SignService) {
  }

  getCaptcha() {
    this.captchaUrl = "/captcha?rand="+ new Date().getTime();
  }

  onSignup() {
    if (this.options) this.options.showSign = SignType.SignUpDialog;
  }

  onForgetPassword() {
    if (this.options) this.options.showSign = SignType.ForgetPasswordDialog;
  }

  onSubmit() {
    if (this.currentForm.form.invalid) return;

    this.saving = true;
    this._signService.Signin(this.user).subscribe(
      ret => {
        if (ret.errorTip) {
          this.getCaptcha();
        }
      },
      err => console.error(err),
      () => this.saving = false
    );
  }

}
