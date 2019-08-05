import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalaChatPage } from './sala-chat';

@NgModule({
  declarations: [
    SalaChatPage,
  ],
  imports: [
    IonicPageModule.forChild(SalaChatPage),
  ],
})
export class SalaChatPageModule {}
