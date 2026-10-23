import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormUtils } from '../../../../utils/form-utils';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { CompanyLine } from '../../../../Services/company-line.service';

@Component({
  selector: 'app-create-company-line',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-company-line.html',
})
export class CreateCompanyLine {

  private fb = inject(FormBuilder);
  private companyLineService = inject(CompanyLine);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    serial: ['', [Validators.required, Validators.maxLength(20)]],
    phone_number: ['', [Validators.required, Validators.minLength(3)]],
    status: ['', [Validators.required]],
    active_status: ['', [Validators.required]],
    operator: ['', [Validators.required]],
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const val = this.myForm.value;
    const newCompanyLine = {
      serial: val.serial,
      phone_number: val.phone_number,
      status: val.status,
      active_status: val.active_status,
      operator: val.operator,
    };

    this.companyLineService.addCompanyLine(newCompanyLine).subscribe({
      next: (res) => {
        console.log('Company line created successfully:', res);
        alert('Company line created successfully!');
        this.myForm.reset();
      },
      error: (err) => {
        console.error('Error creating company line:', err);
        const errMsg = err.error?.details?.sqlMessage || err.error?.error || err.message || 'Error desconocido';
        alert(`Error creating company line: ${errMsg}`);
      }
    })
  }
}
