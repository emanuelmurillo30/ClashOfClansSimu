import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AyuntamientoComponent } from './ayuntamiento/ayuntamiento.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { MinaComponent } from './mina/mina.component';
import { ElixirComponent } from './elixir/elixir.component';
import { CuartelComponent } from './cuartel/cuartel.component';

const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: '',
        component: AyuntamientoComponent,
      },
      {
        path: 'mina',
        component: MinaComponent,
      },
      {
        path: 'elixir',
        component: ElixirComponent,
      },
      {
        path: 'cuartel',
        component: CuartelComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
