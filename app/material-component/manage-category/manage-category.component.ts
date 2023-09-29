import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryService } from 'src/services/category.service';
import { SnackbarService } from 'src/services/snackbar.service';
import { CategoryComponent } from '../dialog/category/category.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit{
  displayedColumns: string[]=['name','edit'];
  dataSource:any;
  responseMessage:any;
  appearance: MatFormFieldAppearance = 'fill';


  constructor(private categoryService:CategoryService,
    private router:Router,
    private snackbarService:SnackbarService,
    public dialogRef:MatDialog,
    private ngxService:NgxUiLoaderService){ }

  ngOnInit():void{
    this.ngxService.start();
    this.tableData();


  }
  tableData(){
    this.categoryService.getCategorys().subscribe((response:any)=>{
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
    const dialogRef = this.dialogRef.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
      const sub=dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
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
    const dialogRef = this.dialogRef.open(CategoryComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
      const sub=dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
        this.tableData();
      })
    
  }

}
