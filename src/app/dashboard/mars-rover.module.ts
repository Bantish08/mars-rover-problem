import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarsRoverRoutingModule } from "./mars-rover-routing.module";
import { MarsRoverComponent } from "./components/mars-rover.component";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    MarsRoverComponent
  ],
  imports: [
    CommonModule,
    MarsRoverRoutingModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ]
})
export class MarsRoverModule { }
