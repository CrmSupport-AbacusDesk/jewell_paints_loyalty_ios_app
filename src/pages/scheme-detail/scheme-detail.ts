import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { App, IonicPage, Loading, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the SchemeDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheme-detail',
  templateUrl: 'scheme-detail.html',
})


export class SchemeDetailPage {
  prod_id:any='';
  scheme_detail:any={};
  product_point:any=[];
  prod_data:any=[];
  prod_detail_image:any={};
  loading:Loading;
  upload_url:any="";
  userType:any ={};

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App,public translate:TranslateService,public modalCtrl:ModalController,public con:ConstantProvider) {
    this.presentLoading();
    console.log(this.service);
    this.prod_id = this.navParams.get('id');
    this.userType = this.navParams.get('userType');
    this.service.karigar_status;
    console.log(this.service.karigar_status);
    
  }
  
  ionViewDidLoad() {
   

    this.getProductDetail(this.prod_id);
  }


  getProductDetail(id)
  {
    console.log(id);
    
    this.service.post_rqst({'scheme_id' :id},'app_master/scheme_detail')
    .subscribe( (r) =>
    {
      console.log(r);
      this.scheme_detail = r.scheme;
      this.product_point = r.product_point

      this.loading.dismiss();
    });
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
