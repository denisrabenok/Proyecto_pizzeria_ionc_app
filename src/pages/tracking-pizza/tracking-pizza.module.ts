import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackingPizzaPage } from './tracking-pizza';

@NgModule({
  declarations: [
    TrackingPizzaPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackingPizzaPage),
  ],
})
export class TrackingPizzaPageModule {}
