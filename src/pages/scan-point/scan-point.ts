import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, Loading, ModalController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { CongratulationsPage } from '../congratulations/congratulations';
import { HomePage } from '../home/home';
import { CoupanCodePage } from '../scane-pages/coupan-code/coupan-code';

/**
* Generated class for the ScanPointPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-scan-point',
  templateUrl: 'scan-point.html',
})
export class ScanPointPage {
  offer_list:any=[];
  data:any={};
  loading:Loading;
  karigar_detail:any={};
  qr_code:any='';
  coupon_value:any='';
  search:any
  lang:any="";
  qr_count:any=0;
  qr_limit:any=0;
  active:boolean = false;
  totalPoint =0;
  scheme:any =[];
  schemePoint:any = {};
  constructor(public navCtrl: NavController,public translate:TranslateService, private barcodeScanner: BarcodeScanner, public navParams: NavParams, public alertCtrl:AlertController, public modalCtrl:ModalController, public service:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanPointPage');
  }
  
  ionViewWillEnter(){
    
  }
  
  
  
  
  
  
  showSuccessPoint(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      cssClass:'sucess-alert',
      message: `<img src="assets/imgs/sucess.gif"  alt="sucess">`,
      subTitle: text,
      buttons: [ {
        text: 'Scan More',
        handler: () => {
          this.scan_tips();
        }
      },
      {
        text: 'Okay',
        handler: () => {
          
        }
      }
    ]
    
    
  });
  alert.present();
}
showAlert(text)
{
  let alert = this.alertCtrl.create({
    title:'Alert!',
    cssClass:'action-close',
    subTitle: text,
    buttons: [ {
      text: 'Scan again',
      handler: () => {
        this.scan_tips();
      }
    },
    {
      text: 'Okay',
      handler: () => {
        
      }
    }
  ]
});
alert.present();
}
showSuccess(text)
{
  let alert = this.alertCtrl.create({
    title:'Success!',
    cssClass:'action-close',
    subTitle: text,
    buttons: ['OK']
  });
  alert.present();
}

formAlert(text)
{
  let alert = this.alertCtrl.create({
    title:'Alert!',
    cssClass:'action-close',
    subTitle: text,
    buttons: [ {
      handler: () => {
        this.scan_tips();
      }
    },
    {
      text: 'Okay',
      handler: () => {
        
      }
    }
  ]
});
alert.present();
}


scan_tips()
{
  this.scan();
}

qrCodeData:any =[]
scan()
{
  if( this.karigar_detail.manual_permission==1)
  {
    this.navCtrl.push(CoupanCodePage)
  }
  else
  {
    this.service.post_rqst({'karigar_id':this.service.karigar_id},"app_karigar/get_qr_permission")
    .subscribe(resp=>{
      console.log(resp);
      this.qr_count = resp['karigar_daily_count'];
      this.qr_limit = resp['qr_limit'];
      console.log(this.qr_count);
      console.log(this.qr_limit);
      
      if(parseInt(this.qr_count) <= parseInt(this.qr_limit) )
      {
        const options:BarcodeScannerOptions =  { 
          prompt : ""
        };
        this.barcodeScanner.scan(options).then(resp => {
          console.log(resp);
          this.qr_code=resp.text;
          console.log( this.qr_code);
          if(resp.text != '')
          {
            this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code},'app_karigar/checkCoupon')
            .subscribe((r:any)=>
            {
              console.log(r);
              
              if(r['status'] == 'INVALID'){
                this.translate.get("Invalid Coupon Code")
                .subscribe(resp=>{
                  this.showAlert(resp);
                })
                return;
              }
              else if(r['status'] == 'NO-OFFER'){
                this.translate.get("This coupon does not have any active offer. Scan different coupon")
                .subscribe(resp=>{
                  this.showAlert(resp);
                })
                return;
              }
              else if(r['status'] == 'USED'){
                this.translate.get("Coupon Already Used")
                .subscribe(resp=>{
                  this.showAlert(resp);
                })
                return;
              }
              
              
              
              if(this.qrCodeData.findIndex( qr_code => qr_code.qr_code == this.qr_code) == -1){
                this.qrCodeData.push({'qr_code':this.qr_code, 'coupon_value':r.coupon_value, 'product_name':r.product_name}); 
                this.totalPoint += r.coupon_value;
                console.log(this.totalPoint);
                
              }
              else{
                this.showAlert('Coupon Already Scanned');
                return
              }
              this.showSuccessPoint(r['coupon_value']  + " points has been scanned");
            });
          }
          else{
          }
        });
      }
      else
      {
        this.translate.get("You have exceed the daily QR scan limit")
        .subscribe(resp=>{
          this.showAlert(resp);
        })
      }
    })
  }
}


delete(i, value){
  this.qrCodeData.splice(i, 1);
  this.totalPoint = this.totalPoint - value;
}

contractorsData:any =[];
saveFlag:any = true

checkNumber(mobile)
{
  
  console.log(mobile);
  
  
  
  if(mobile.length == 10){
    this.service.post_rqst( {'mobile_no':mobile, 'karigar_id':this.service.karigar_id},'app_karigar/checkNumber')
    .subscribe( (r) =>
    {
      console.log(r,'check number');
      
      
      
      if(r.status == 'OWNEXIST'){
        this.formAlert('You cannot add own number');
        this.saveFlag =false;
        return
      }
      
      else if(r.status == 'EXIST'){
        this.formAlert('This mobile number is already used by another dealer');
        this.saveFlag =false;
        return;
      }
      
      else if(r.status == 'NOTEXIST'){
        this.saveFlag =true;
        this.getContractor(mobile);
      }
      
      else{
        
      }
      
      // if(r.contractors == null){
      //   this.data.contractor_id = 0;
      //   console.log('enter id ');
      
      // }
      // else{
      //   this.data.contractor_name = r.contractors.first_name;
      //   this.data.contractor_id = r.contractors.id;
      //   console.log(this.data.contractor_name);
      // }
    });
  }
  
  
}

getContractor(mobile)
{
  if(mobile.length == 10){
    this.service.post_rqst( {'search':mobile},'app_karigar/getContractors')
    .subscribe( (r) =>
    {
      console.log(r);
      
      if(r.contractors == null){
        this.data.contractor_id = 0;
        console.log('enter id ');
        
      }
      else{
        this.data.contractor_name = r.contractors.first_name;
        this.data.contractor_id = r.contractors.id;
        console.log(this.data.contractor_name);
      }
    });
  }
  else{
    this.data.contractor_name =""
  }
  
  
}


submit()
{
  
  if(this.data.painter_mobile == this.data.contractor_mobile){
    this.formAlert('Contractor & painter mobile number should be different');
    return;
  }
  else if(this.saveFlag == false){
    this.formAlert('Dealer & contractor mobile number should be different');
    return;
  }
  
  this.data.dealer_id = this.service.karigar_id;
  this.service.post_rqst( {'data': this.data, 'qr_code':this.qrCodeData  },'app_karigar/saveCoupon')
  .subscribe( (r) =>
  {
    console.log(r);
    
    if (r.status == 'SCHEME'){
      this.scheme= r.scheme;
      this.schemePoint = this.scheme[0];
      let contactModal = this.modalCtrl.create(CongratulationsPage, {'points':this.schemePoint.dealer_point, 'type':'Scheme'});
      contactModal.present();
      return;
    }
    else if (r.status == 'LUCKY'){
      let contactModal = this.modalCtrl.create(CongratulationsPage, {'points':r.lucky,  'type':'Lucky'});
      contactModal.present();
      return;
    }
    else{
      this.navCtrl.push(HomePage);
      this.showSuccess('Wallet update successfully');
    }
    
    
  });
}

}
