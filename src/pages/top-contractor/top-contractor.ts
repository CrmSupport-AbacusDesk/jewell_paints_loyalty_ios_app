import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TopContractorDetailPage } from '../top-contractor-detail/top-contractor-detail';

/**
* Generated class for the TopContractorPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-top-contractor',
  templateUrl: 'top-contractor.html',
})
export class TopContractorPage {
  
  loading:Loading;
  data:any=[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public translate:TranslateService, public loadingCtrl:LoadingController, public service:DbserviceProvider) {
  }
  
  
  ionViewWillEnter()
  {
    this.presentLoading();
    this.getContractorList();
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
  
  doRefresh(refresher) 
  {
    
    this.getContractorList(); 
    refresher.complete();
  }
  
  ionViewDidLoad() {
  }
  
  getContractorList()
  {
    this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/dealerTopContractors')
    .subscribe( (r) =>
    {
      console.log(r);
      this.data = r.contractors;
      console.log( this.data);
      
      this.loading.dismiss();
      
    });
  }
  
  
  goToDetail(id, string)
  {
    console.log(string);
    this.navCtrl.push(TopContractorDetailPage,{"id":id, 'contractor_data':string});
  }
  
}
