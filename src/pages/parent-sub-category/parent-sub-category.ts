import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
 * Generated class for the ParentSubCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parent-sub-category',
  templateUrl: 'parent-sub-category.html',
})
export class ParentSubCategoryPage {
  data:any ={}
  filter :any = {};
  flag:any='';
  prod_cat_list:any =[]
  loading:any = Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider, public translate:TranslateService,  public loadingCtrl:LoadingController,) {
    console.log(navParams);

    this.data  = this.navParams.data;
    this.presentLoading();
    this.getProductSubCategory();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentSubCategoryPage');
  }

  getProductSubCategory()
  {
    console.log('catagorylist');
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter, 'catalogue_id':this.data.id },'app_karigar/category_list')
    .subscribe( (r) =>
    {
      console.log(r['categories']);
      this.loading.dismiss();
      this.prod_cat_list=r['category_list'];
    });
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

}
