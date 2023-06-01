import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { VideoPage } from '../video/video';

/**
* Generated class for the VideoCategoryListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-video-category-list',
  templateUrl: 'video-category-list.html',
})
export class VideoCategoryListPage {
  filter:any={};
  video_list:any=[];
  loading:Loading;
  SafeResourceUrl;
  tokenInfo:any={};
  lang:any='';
  ok:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,public dom:DomSanitizer,public translate:TranslateService) {
  }
  
  ionViewDidLoad()
  {
    console.log('ionViewDidLoad VideoPage');
    this.getVideoList();
    this.presentLoading();
  }
  
  
  doRefresh(refresher) 
  {
    this.getVideoList()
    refresher.complete();
  }
  
  getVideoList()
  {
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter},'app_master/video_category').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        this.video_list=r['category'];
       
      });
    }
    presentLoading() 
    {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
        this.loading = this.loadingCtrl.create({
          content:resp,
          dismissOnPageChange: false
        });
        this.loading.present();
      })
    }
    
    
    
    flag:any='';
    
    loadData(infiniteScroll)
    {
      console.log('loading');
      this.filter.limit=this.video_list.length;
      this.service.post_rqst({'filter' : this.filter},'app_master/video_category').subscribe( r =>
        {
          console.log(r);
          if(r['category'] == '')
          {
            this.flag=1;
          }
          else 
          {
            setTimeout(()=>{
              this.video_list=this.video_list.concat(r['category']);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
      }
      govideoList(id, name){
        this.navCtrl.push(VideoPage, {'id': id, 'name':name})
      }
    }