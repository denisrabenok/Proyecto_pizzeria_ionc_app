import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListLocalesPage } from './list-locales';

@NgModule({
  declarations: [
    ListLocalesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListLocalesPage),
  ],
})
export class ListLocalesPageModule {}
