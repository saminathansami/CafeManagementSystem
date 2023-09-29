import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductService } from 'src/services/product.service';
import { SnackbarService } from 'src/services/snackbar.service';
import { CategoryComponent } from '../dialog/category/category.component';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {

  displayedColumns: string[]=['name','categoryName','description','price','edit'];
  dataSource:any;
 // length1:any;
  responseMessage:any;
  appearance: MatFormFieldAppearance = 'fill';

  constructor(private productService:ProductService,
    private router:Router,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialog,
    private ngxService:NgxUiLoaderService
    ){ }

  ngOnInit():void{
    this.ngxService.start();
    this.tableData();


  }

  tableData(){
    this.productService.getProducts().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error)=>{
      this.ngxService.stop();
      console.log(error?.message);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
      
  }

  applyFilter(event:Event){
    const filterValue =(event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleAddAction(){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.data ={
      action:'Add'
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialogRef.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
      const sub=dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
        this.tableData();
      })
    
  }

  handleEditAction(values:any){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.data ={
      action:'Edit',
      data:values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialogRef.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
      const sub=dialogRef.componentInstance.onEditProduct.subscribe((response)=>{
        this.tableData();
      })
    
  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'delete'+values.name+'product',confirmation:true
    }
    const dialogRef = this.dialogRef.open(ConfirmationComponent,dialogConfig);
    const sub=dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    this.productService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response.error?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  onChange(status:any,id:any){
    this.ngxService.start();
    var data ={
      status:status.toString(),
      id:id
  }
  this.productService.updateStatus(data).subscribe((response:any)=>{
    this.ngxService.stop();
      this.responseMessage = response.error?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
  },(error)=>{
    this.ngxService.stop();
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }else{
      this.responseMessage=GlobalConstants.genericError;
    }
    this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
  })


  }

}
