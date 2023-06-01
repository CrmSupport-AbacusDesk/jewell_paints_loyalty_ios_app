import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PointListPage } from '../points/point-list/point-list';

/**
 * Generated class for the CongratulationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-congratulations',
  templateUrl: 'congratulations.html',
})
export class CongratulationsPage {

  earnPoint :any ={};
  type:any ={};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController ) {
    console.log(navParams);

    this.earnPoint = navParams.data.points;
    this.type = navParams.data.type;

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CongratulationsPage');
  }

  goToPoint()
  {
      this.navCtrl.setRoot(HomePage);
      this.viewCtrl.dismiss();
  }

}
