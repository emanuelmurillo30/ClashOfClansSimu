import { Component } from '@angular/core';
import { HandlerService } from '../services/handler.service';

@Component({
  selector: 'app-cuartel',
  templateUrl: './cuartel.component.html',
  styleUrl: './cuartel.component.css'
})
export class CuartelComponent {
  public dataAyuntamiento: any;
  public dataCuartel: any;
  public numeroTropas: number = 0;

  constructor(private handle: HandlerService) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.handle
      .cuartelObservable
      .subscribe(data => {
        this.dataCuartel = data;
      });
    
    this.handle
      .ayuntamientoObservable
      .subscribe(data => {

        this.dataAyuntamiento = data;
      })
  }

  public agregarCuartel() {
    if(!this.dataCuartel) return;
    if(!this.dataAyuntamiento || !this.dataAyuntamiento.maximaCantidadCuartelNivel) return;

    if(this.dataCuartel.cantidadCuartel < this.dataAyuntamiento.maximaCantidadCuartelNivel) {
      this.dataCuartel.cantidadCuartel++;
      this.dataCuartel.cuarteles.push(
        {
          nivel: 1,
          tropasColas: 0,
        }
      );
      this.handle.atualizarCuartel(this.dataCuartel);
    }
  }

  public updateNivel(i: number) {
    if(!this.dataCuartel) return;
    if(!this.dataCuartel.cuarteles || !this.dataCuartel.cuarteles.length) return;

    if(this.dataCuartel.cuarteles[i].nivel < this.dataAyuntamiento.maximaNivelElixir) {
      this.dataCuartel.cuarteles[i].nivel++;
    }
  }
}
