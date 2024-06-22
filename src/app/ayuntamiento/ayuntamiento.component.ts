import { Component } from '@angular/core';
import { HandlerService } from '../services/handler.service';

@Component({
  selector: 'app-ayuntamiento',
  templateUrl: './ayuntamiento.component.html',
  styleUrl: './ayuntamiento.component.css'
})
export class AyuntamientoComponent {

  public dataAyuntamiento: any;

  constructor(private handle: HandlerService) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    
    this.handle
      .ayuntamientoObservable
      .subscribe(data => {

        this.dataAyuntamiento = data;
      })
  }

  public updateNivel() {
    console.log(this.dataAyuntamiento)
    if(this.dataAyuntamiento && this.dataAyuntamiento.nivel) {
      this.dataAyuntamiento.nivel++;

      if(this.dataAyuntamiento.maximaCantidadMinaNivel < this.dataAyuntamiento.maximaCantidadMinaTotal)
        this.dataAyuntamiento.maximaCantidadMinaNivel++;

      if(this.dataAyuntamiento.maximaNivelMina < this.dataAyuntamiento.maximaNivelMinaTotal)
        this.dataAyuntamiento.maximaNivelMina++;

      if(this.dataAyuntamiento.maximaCantidadElixirNivel < this.dataAyuntamiento.maximaCantidadElixirTotal)
        this.dataAyuntamiento.maximaCantidadElixirNivel++;

      if(this.dataAyuntamiento.maximaNivelElixir < this.dataAyuntamiento.maximaNivelElixirTotal)
        this.dataAyuntamiento.maximaNivelElixir++;

      if(this.dataAyuntamiento.maximaCantidadCuartelNivel < this.dataAyuntamiento.maximaCantidadCuartelTotal)
        this.dataAyuntamiento.maximaCantidadCuartelNivel++;

      if(this.dataAyuntamiento.maximaNivelCuartel < this.dataAyuntamiento.maximaNivelCuartelTotal)
        this.dataAyuntamiento.maximaNivelCuartel++;

      this.handle.atualizarAyuntamiento(this.dataAyuntamiento);
    }
  }

}
