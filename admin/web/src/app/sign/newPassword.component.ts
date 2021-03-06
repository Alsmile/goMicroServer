import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NoticeService } from 'le5le-components';

import { SignService, SignType } from "./sign.service";

@Component({
  selector: 'new-password',
  templateUrl: "newPassword.component.html"
})
export class NewPasswordComponent{
  @Input() code: string = '';
  @Input() email: string = '';
  @Input() options: any;
  user: any = {password: ''};
  saving: boolean;
  @ViewChild('newPasswordForm') currentForm: NgForm;
  constructor(private _signService: SignService) {
  }

  async onSubmit(): Promise<void> {
    if (this.currentForm.form.invalid) return;

    this.saving = true;
    let ret = await this._signService.NewPassword({
      passwordCode: this.code,
      password: this.user.password
    });
    if (ret) {
      let _noticeService: NoticeService = new NoticeService();
      _noticeService.notice({body: '密码修改成功，请使用新密码登录！', theme: 'success'});
      if (this.options) this.options.showSign = null;
    }
    this.saving = false;
  }
}
