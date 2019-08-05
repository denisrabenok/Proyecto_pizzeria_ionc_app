import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PizzaTresPage } from './pizza-tres';

@NgModule({
  declarations: [
    PizzaTresPage,
  ],
  imports: [
    IonicPageModule.forChild(PizzaTresPage),
  ],
})
export class PizzaTresPageModule {}
