import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, App, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewProfilePage } from '../view-profile/view-profile';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
    selector: 'page-dealer-dealer-list',
    templateUrl: 'dealer-dealer-list.html',
})
export class DealerDealerListPage
{
    complaint_list : any=[];
    loading:Loading;
    filter:any={};
    flag:any='';
    complaint_count:any='';
    data:any={};
    complaint: string = "Pending";
    dealerData:any =[];
    constructor( private app:App,
        public modalCtrl: ModalController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public storage:Storage,
        public dbService:DbserviceProvider,
        public translate:TranslateService,
        public loadingCtrl: LoadingController){
            this.getDealer()
        }
        
        ionViewWillEnter()
        {
            
        }
        ionViewDidLoad() {
            this.presentLoading();
        }
        
        
        
        doRefresh(refresher)
        {
            this.getDealer();
            refresher.complete();
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
        
        getDealer()
        {
            this.flag=0;
            this.filter.limit = 0;
            this.filter.karigar_id =this.dbService.karigar_id;
            
            this.dbService.post_rqst( {'filter':this.filter}, 'app_karigar/dealerList').subscribe(response =>
                {
                    console.log(response);
                    this.loading.dismiss();
                    this.dealerData =  response.dealers;
                });
            }
            
            loadData(infiniteScroll)
            {
                this.filter.limit=this.dealerData.length;
                this.dbService.post_rqst({'filter' : this.filter},'app_karigar/dealerList').subscribe( r =>
                    {
                        if(r['dealers']=='')
                        {
                            this.flag=1;
                        }
                        else
                        {
                            setTimeout(()=>{
                                this.dealerData=this.dealerData.concat(r['dealers']);
                                infiniteScroll.complete();
                            },1000);
                        }
                    });
                }
                
                
            }
            