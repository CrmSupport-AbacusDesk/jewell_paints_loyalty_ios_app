import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SchemeDetailPage } from '../scheme-detail/scheme-detail';

/**
* Generated class for the SchemeListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-scheme-list',
  templateUrl: 'scheme-list.html',
})

export class SchemeListPage {
  cat_id:any='';
  flag:any='';
  filter :any = {};
  schemeData:any=[];
  prod_cat:any='';
  loading:Loading;
  upload_url:any='';
  userType:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController, private app:App,public translate:TranslateService,public con:ConstantProvider) {
  
    console.log(navParams);
    
  }
  
  ionViewDidLoad() {
    this.cat_id = this.navParams.get('id');
    this.userType = this.navParams.get('userType');
    this.presentLoading();
    this.getProductList(this.cat_id);
    this.upload_url = this.con.upload_url;
  }
  
  goOnProductSubDetailPage(id){
    this.navCtrl.push(SchemeDetailPage,{'id':id,'userType':this.userType })
  }
  
  
  
  
  getProductList(id)
  {
    this.filter.limit = 0;
    this.filter.id=id;
    this.service.post_rqst({'filter':this.filter, 'karigar_id':this.service.karigar_id},'app_master/scheme_list')
    .subscribe( (r) =>
    {
      console.log(r);
      this.schemeData = r.scheme
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
        this.navCtrl.popToRoot();
      }
    }
  }
  
  loadData(infiniteScroll)
  {
    console.log(infiniteScroll);
    
    console.log('loading');
    this.filter.limit=this.schemeData.length;
    console.log(this.filter.limit);
    this.service.post_rqst({'filter' : this.filter, 'karigar_id':this.service.karigar_id },'app_master/scheme_list')
    .subscribe( (r) =>
    {
      console.log(r);
      if(r['products']=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.schemeData=this.schemeData.concat(r['products']);
          console.log('Asyn operation has stop')
          infiniteScroll.complete();
        },1000);
      }
    });
  }
  
  
  doRefresh(refresher) 
  {
    this.getProductList(this.cat_id)
    refresher.complete();
    
  }
}