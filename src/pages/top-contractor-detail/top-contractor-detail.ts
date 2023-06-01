import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the TopContractorDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-contractor-detail',
  templateUrl: 'top-contractor-detail.html',
})
export class TopContractorDetailPage {

  loading:Loading
  contractor_id:any;
  contractor_data:any = {};
  contractor_mobile:any;
  contractor_bal:any;
  filter :any = {};
  flag:any='';

  coupondata:any =[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public translate:TranslateService, public loadingCtrl:LoadingController, public service:DbserviceProvider) {
    console.log(navParams);
    this.contractor_id =navParams.data.id;
    console.log(navParams.data.contractor_data.first_name);
    this.contractor_data = navParams.data.contractor_data;
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

  ionViewWillEnter()
  {
    this.presentLoading();
    this.getContractorDetail();
  }
  

  ionViewDidLoad() {
   
  }

  getContractorDetail()
  {
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter, 'dealer_id':this.service.karigar_id, 'contractor_id':this.contractor_id},'app_karigar/dealerContractorTransaction')
    .subscribe( (r) =>
    {
      console.log(r);
      this.coupondata = r.transaction;
      // console.log( this.data);
      
      this.loading.dismiss();
      
    });
  }


  loadData(infiniteScroll)
  {
      console.log(infiniteScroll);
      
      console.log('loading');
      this.filter.limit=this.coupondata.length;
      console.log(this.filter.limit);
      this.service.post_rqst({'filter' : this.filter, 'dealer_id':this.service.karigar_id, 'contractor_id':this.contractor_id},'app_karigar/dealerContractorTransaction')
      .subscribe( (r) =>
      {
          console.log(r);
          if(r['transaction']=='')
          {
              this.flag=1;
          }
          else
          {
              setTimeout(()=>{
                  this.coupondata=this.coupondata.concat(r['transaction']);
                  console.log('Asyn operation has stop')
                  infiniteScroll.complete();
              },1000);
          }
      });
  }

}
