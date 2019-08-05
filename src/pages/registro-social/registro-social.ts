import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { InicioPage } from '../inicio/inicio';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the RegistroSocialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro-social',
  templateUrl: 'registro-social.html',
})
export class RegistroSocialPage {

  validations_form: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  dataUsuario = {
    "CORREO" : "",
    "CONTRASENA" : "",
    "NOMBRES" : "",
    "APELLIDOS" : "",
    "CEDULA" : "",
    "TELEFONO" : ""
  };
  respuesta: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: AuthServiceProvider ,  public formBuilder: FormBuilder) {

      this.dataUsuario = Object.assign({}, this.navParams.data);

    this.validations_form = this.formBuilder.group({
      correo: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required
      ])),
      nombres: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      contrasena: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),

      });
  }

  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  validation_messages = {
    'correo': [
      { type: 'required', message: 'El Correo es obligatorio' },
      { type: 'pattern', message: 'No cumple con la estructura de un correo.' }
    ],
    'nombres': [
      { type: 'required', message: 'Los nombres son obligatorios' }
    ],
    'apellidos': [
      { type: 'required', message: 'Los apellidos son obligatorios' }
    ],
    'contrasena': [
      { type: 'required', message: 'La contrasena es obligatoria' },
      { type: 'minlength', message: 'La contrasena debe tener minimo 5 caracteres' },
      { type: 'pattern', message: 'Su contrasena debe tener al menos una mayuscula, una minuscula y un numero.' }
    ],
  };

  onSubmit(values){
    this.authService.postData(this.dataUsuario, "registrar").then((res)=>{
      this.respuesta = res;
      //localStorage.setItem('dataUsuario', JSON.stringif(this.respuesta));
      if (this.respuesta.RESPUESTA == "EXITO") {
        this.navCtrl.setRoot(InicioPage);
      }
    }, (err)=>{
      //Mensaje de error
    });
  }

}
