import { DatePipe, JsonPipe, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { AvailableLocal, LocaleService } from '../../../Services/locale.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { User } from '../../../models/User';

@Component({
  selector: 'create-page',
  imports: [
    /* LowerCasePipe, 
    UpperCasePipe, */
    TitleCasePipe,
    /* DatePipe,
    JsonPipe, */
    ReactiveFormsModule,
  ],
  templateUrl: './create-page.html',
})
export class CreatePage {

  //! de prueba nada mas
  /* LocaleService = inject(LocaleService);
  currentLocale = signal(this.LocaleService.getLocal());
  // currentLocale = signal(inject(LOCALE_ID))

  nameLower = signal('ezio');
  nameUpper = signal('EZIO')
  fullName = signal('EZio AudiROre');


  customDate = signal( new Date() );

  tikingDateEffect = effect( (onCleanup) => {

    const interval = setInterval( () => {

      this.customDate.set( new Date() );
    }, 1000);

    onCleanup( () => {
      clearInterval( interval );
    });
  });

  changeLocale(locale: AvailableLocal) {
    console.log({ locale });
    this.LocaleService.changeLocal(locale);
  } */
  
  //! de prueba nada mas 
  private fb = inject(FormBuilder);
  formUtils = FormUtils

  user = new User(); 

  myForm: FormGroup = this.fb.group({
    //? property: [initialValue, [validators], [asyncValidators]]
    name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.min(3)]],
    position: ['', [Validators.required, Validators.min(0)]],
    department: [0, [Validators.required]],
    place: [0, [Validators.required]],
  });

  onSave() {
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);

    this.myForm.reset({
      price: 0,
      inStorage: 0
    });
  }
  //! de prueba nada mas 


}
