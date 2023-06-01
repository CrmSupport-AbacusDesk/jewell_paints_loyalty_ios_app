import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PainterCouponCodePage } from './painter-coupon-code';
import { createTranslateLoader } from '../offers/offers.module';

@NgModule({
  declarations: [
    PainterCouponCodePage,
  ],
  imports: [
    IonicPageModule.forChild(PainterCouponCodePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class PainterCouponCodePageModule {}
