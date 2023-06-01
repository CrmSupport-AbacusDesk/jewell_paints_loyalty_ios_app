import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ParentSubCategoryPage } from '../parent-sub-category/parent-sub-category';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
* Generated class for the ProductSubCategoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-product-sub-category',
  templateUrl: 'product-sub-category.html',
})
export class ProductSubCategoryPage {
  cat_id:any='';
  cat_name:any='';
  prod_detail:any={};
  filter :any = {};
  flag:any='';
  assign_prod:any=[];
  prod_detail_image:any={};
  loading:Loading;
  lang:any='';
  tokenInfo:any={};
  uploadUrl:any="";
  prod_cat_list:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public con:ConstantProvider, public service:DbserviceProvider, public translate:TranslateService,  public loadingCtrl:LoadingController, private app:App) {

    
  }
  
  ionViewDidLoad() {
    console.log(this.navParams);
    this.cat_id = this.navParams.get('id');
    this.cat_name = this.navParams.get('name');
    console.log(this.cat_id);
    this.uploadUrl = this.con.upload_url;
    this.getProductSubCategory();
    this.presentLoading();
  }
  
  
  
  getProductSubCategory()
  {
    console.log('catagorylist');
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter, 'catalogue_id':this.cat_id },'app_karigar/category_list')
    .subscribe( (r) =>
    {
      console.log(r['categories']);
      this.loading.dismiss();
      this.prod_cat_list=r['category_list'];
    });
  }
  
  
  
  
  // loadData(infiniteScroll)
  // {
  //   console.log(infiniteScroll);
  
  //   console.log('loading');
  //   this.filter.limit=this.subcat_list.length;
  //   console.log(this.filter.limit);
  //   this.service.post_rqst({'filter' : this.filter, 'id':this.cat_id },'app_master/subCategoryList')
  //   .subscribe( (r) =>
  //   {
  //     console.log(r);
  //     if(r['categories']=='')
  //     {
  //       this.flag=1;
  //     }
  //     else
  //     {
  //       setTimeout(()=>{
  //         this.subcat_list=this.subcat_list.concat(r['categories']);
  //         console.log('Asyn operation has stop')
  //         infiniteScroll.complete();
  //       },1000);
  //     }
  //   });
  // }
  
  

  ionViewDidLeave()
  {
      let nav = this.app.getActiveNav();
      if(nav && nav.getActive()) 
      {
          let activeView = nav.getActive().name;
          let previuosView = '';
          if(nav.getPrevious() && nav.getPrevious().name)
          {
              previuosView = nav.getPrevious().name;
          }  
          console.log(previuosView); 
          console.log(activeView);  
          console.log('its leaving');
          if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
          {
              
              console.log(previuosView);
              this.navCtrl.popToRoot();
          }
      }
  }

  checkSubCat(item){
    
    if(item.sub_category_count > 0){
      this.navCtrl.push(ParentSubCategoryPage,{'name':item.catalogue_c_name,'id':item.id})
    }
    else{
      this.navCtrl.push(ProductDetailPage,{'name':item.catalogue_c_name,'id':item.id})
    }
    
    
    
    
  }
  
  presentLoading() 
  {
    this.translate.get("Please wait...")
    .subscribe(resp=>{
      this.loading = this.loadingCtrl.create({
        content: resp,
        dismissOnPageChange: false
      });
      this.loading.present();
    })
  }
  
  goOnProductDetailPage(id){
    this.navCtrl.push(ProductDetailPage,{'id':id})
  }
  
}
