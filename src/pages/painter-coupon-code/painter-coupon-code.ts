import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TabsPage } from '../tabs/tabs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HomePage } from '../home/home';
import { CongratulationsPage } from '../congratulations/congratulations';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the PainterCouponCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-painter-coupon-code',
  templateUrl: 'painter-coupon-code.html',
})
export class PainterCouponCodePage {

  qr_code:any='';
  data:any={};
  flag:any='';
  
  
  qrCodeData:any =[]
  coupon_value:any='';
  search:any
  lang:any="";
  qr_count:any=0;
  qr_limit:any=0;
  active:boolean = false;

  totalPoint =0;
  scheme:any =[];
  schemePoint:any = {};
  painter: any;
  user_type: any;
  
  constructor(public navCtrl: NavController,  public translate:TranslateService, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,  
    public toastCtrl: ToastController,
    public modalCtrl:ModalController) {
      this.user_type = this.navParams.get("user_type");
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad PainterCouponCodePage');
    }
    
    
    showSuccessPoint(text)
    {
      let alert = this.alertCtrl.create({
        title:'Success!',
        cssClass:'sucess-alert',
        message: `<img src="assets/imgs/sucess.gif"  alt="sucess">`,
        subTitle: text,
        buttons: [
          //    {
          //   text: 'Scan More',
          //   handler: () => {
          //     this.scan_tips();
          //   }
          // },
          {
            text: 'Okay',
            handler: () => {
              
            }
          }
        ]
        
        
      });
      alert.present();
    }
    
    presentToast(text) {
      const toast = this.toastCtrl.create({
        message: text,
        duration: 3000
      });
      toast.present();
    }
    
    couponAddList(){
      if(!this.data.code){
        this.presentToast('Please Enter Coupon Code');
        return;
      }
      
      else{
        
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.data.code},'app_karigar/checkCoupon')
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
          
          
          if(this.qrCodeData.findIndex( qr_code => qr_code.qr_code == this.data.code) == -1){
            this.qrCodeData.push({'qr_code':this.data.code, 'coupon_value':r.coupon_value, 'product_name':r.product_name}); 
            this.totalPoint += r.coupon_value;
            console.log(this.totalPoint);
          }
          else{
            this.showAlert('Coupon Already Entered');
            return
          }
          this.showSuccessPoint(r['coupon_value']  + " points has been added");
          this.data.code ='';
          
          
        });
      }
      
      
    }
    // submit(data)
    // {
    //   this.flag=1;
    //   console.log(data);
    //   this.qr_code=data;
    //   this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code},'app_karigar/karigarCoupon').subscribe((r:any)=>
    //   {
    //     console.log(r);
    
    //     if(r['status'] == 'BLANK'){
    //       this.showAlert("This Coupon Code doesn't contain any Value");
    //       return;
    //     }
    //     else if(r['status'] == 'INVALID'){
    //       this.showAlert("Invalid Coupon Code");
    //       return;
    //     }
    //     else if(r['status'] == 'REQUIRED'){
    //       this.showAlert("Please Enter Coupon Code");
    //       return;
    //     }
    //     else if(r['status'] == 'USED'){
    //       this.showAlert("Coupon Already Used");
    //       return;
    //     }
    //     else if(r['status'] == 'UNASSIGNED OFFER'){
    //       this.showAlert("Your Account Under Verification");
    //       return;
    //     }
    //     this.showSuccess( r['coupon_value'] +" points has been added into your wallet")
    //     // this.navCtrl.setRoot(TabsPage,{index:'0'});
    //     this.navCtrl.push(HomePage);
    //   });
    // }
    
    
    formAlert(text)
    {
      let alert = this.alertCtrl.create({
        title:'Alert!',
        cssClass:'action-close',
        subTitle: text,
        buttons: [ {
          handler: () => {
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
      buttons: ['OK']
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
  
  delete(i, value){
    this.qrCodeData.splice(i, 1);
    this.totalPoint = this.totalPoint - value;
  }
  
  contractorsData:any =[];
  saveFlag:any = true;
  saveFlag2:any = false;
  
  checkNumber(mobile)
  {
    
    console.log(mobile);
    
    
    
    if(mobile.length == 10){
      this.service.post_rqst( {'mobile_no':mobile, 'karigar_id':this.service.karigar_id},'app_karigar/checkNumberPainter')
      .subscribe( (r) =>
      {
        console.log(r,'check number');
        
        
        
        // if(r.status == 'OWNEXIST'){
        //   this.saveFlag2 = true;
        //   this.formAlert('You cannot add own number');
        //   this.saveFlag =false;
        //   return
        // }
        
         if(r.status == 'DEALER_EXIST'){
          this.saveFlag2 = true;
          this.formAlert('This mobile number is already used by another dealer');
          this.saveFlag =false;
          return;
        }
        else if (r.status == 'PAINTER_EXIST') {
          this.saveFlag2 = true;
          this.formAlert('This mobile number is already used by another painter');
          this.saveFlag = false;
          return;
        }
        
        else if(r.status == 'NOTEXIST'){
          this.saveFlag2 = true;
          this.saveFlag =true;
          // this.getContractors(mobile);
        }

        else if( r.status == 'CONTRACTOR_EXIST'){
          this.saveFlag2 = false;
          this.saveFlag =true;
          this.getContractors(mobile);
        }
        else if( r.status == 'OWNEXIST'){
          this.saveFlag2 = false;
          this.saveFlag =true;
          this.getContractors(mobile);
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
  
  getContractors(mobile)
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

          // this.data.painter_name = r.contractors.first_name;
          // this.data.contractor_id = r.contractors.id;


          console.log(this.data.contractor_name);
        }
      });
    }
    else{
      this.data.contractor_name =""
    }
    
    
  }
  




  
  // getKarigarDetail()
  // {
  //     console.log('karigar');
      
  //     this.service.post_rqst( {'karigar_id': this.service.karigar_id },'app_karigar/profile')
  //     .subscribe((r) =>
  //     {
      
  //         this.painter=r['karigar'];


  //          this.data.painter_name = r.karigar.first_name;
        
  //          this.data.painter_mobile = r.karigar.mobile_no;
        
  //     });
  // }




  
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
    
    this.data.painter_id = this.service.karigar_id;
    // this.data.painter_name = this.service.karigar_id;
    // this.data.painter_mobile = this.service.karigar_id;

    this.service.post_rqst( {'data': this.data, 'qr_code':this.qrCodeData  },'app_karigar/painterSaveCoupon')
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
