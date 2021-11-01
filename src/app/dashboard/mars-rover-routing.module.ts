import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarsRoverComponent } from './components/mars-rover.component';

const routes: Routes = [
  { path: '', component: MarsRoverComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MarsRoverRoutingModule { }
