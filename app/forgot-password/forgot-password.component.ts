import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/services/snackbar.service';
import { UserService } from 'src/services/user.service';
import { SignupComponent } from '../signup/signup.component';
import { GlobalConstants } from '../shared/global-constants';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm:any=FormGroup;
  responseMessage:any;
  appearance: MatFormFieldAppearance = 'fill';
  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService){}
  
  ngOnInit(): void {
    this.forgotPasswordForm=this.formBuilder.group({

      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],

  });
}

handleSubmit(){
  this.ngxService.start();
  var formData = this.forgotPasswordForm.value;
  var data ={
    email:formData.email
}

this.userService.forgotPassword(data).subscribe((response:any)=>{
  this.ngxService.stop();
  this.dialogRef.close();
  this.responseMessage=response?.message;
  this.snackbarService.openSnackBar(this.responseMessage,"");
},(error)=>{
  this.ngxService.stop();
  if(error.error?.message){
    this.responseMessage = error.error?.message;
  }else{
    this.responseMessage=GlobalConstants.genericError;
  }
  this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);

});
}
}
