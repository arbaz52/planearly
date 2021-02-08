import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityDetails } from '../city.service';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.scss'],
})
export class EditCityComponent implements OnInit, OnChanges {
  @Input()
  cityDetails: CityDetails;

  editCity: FormGroup;

  @Output()
  update: EventEmitter<UpdateCity> = new EventEmitter();

  @Output()
  remove: EventEmitter<string> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.editCity = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }
  // set default value for input field on when component renders
  ngOnChanges(changes: SimpleChanges): void {
    this.editCity.setValue({
      name: this.cityDetails.name,
    });
  }
  getName() {
    return this.editCity.get('name');
  }

  ngOnInit(): void {
    this.editCity.setValue({
      name: this.cityDetails.name,
    });
  }

  updateThis() {
    const { id } = this.cityDetails;
    const name = this.getName().value;
    this.update.emit({
      id,
      name,
    });
  }
  removeThis() {
    const { id } = this.cityDetails;
    this.remove.emit(id);
  }
}

export interface UpdateCity {
  id: string;
  name: string;
}
