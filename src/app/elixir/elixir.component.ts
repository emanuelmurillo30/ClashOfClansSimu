import { Component } from '@angular/core';
import { HandlerService } from '../services/handler.service';

@Component({
  selector: 'app-elixir',
  templateUrl: './elixir.component.html',
  styleUrl: './elixir.component.css'
})
export class ElixirComponent {
  public dataAyuntamiento: any;
  public dataElixir: any;

  constructor(private handle: HandlerService) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.handle
      .elixirObservable
      .subscribe(data => {
        this.dataElixir = data;
      });
    
    this.handle
      .ayuntamientoObservable
      .subscribe(data => {

        this.dataAyuntamiento = data;
      })
  }

  public updateNivel(i: number) {
    if(!this.dataElixir) return;
    if(!this.dataElixir.elixirs || !this.dataElixir.elixirs.length) return;

    if(this.dataElixir.elixirs[i].nivel < this.dataAyuntamiento.maximaNivelElixir) {
      this.dataElixir.elixirs[i].nivel++;
      this.dataElixir.elixirs[i].velocidadProduccion *= this.dataElixir.elixirs[i].nivel;
    }
  }

  public agregarElixir() {
    if(!this.dataElixir) return;
    if(!this.dataAyuntamiento || !this.dataAyuntamiento.maximaCantidadElixirNivel) return;

    if(this.dataElixir.cantidadElixirs < this.dataAyuntamiento.maximaCantidadElixirNivel) {
      this.dataElixir.cantidadElixirs++;
      this.dataElixir.elixirs.push(
        {
          nivel: 1,
          producionElixir: 0,
          velocidadProduccion: 0.1
        }
      );
      this.handle.atualizarElixir(this.dataElixir);
    }
  }

  public recogerElixir(i: number) {
    if(!this.dataElixir) return;
    if(!this.dataElixir.elixirs || !this.dataElixir.elixirs.length) return;
    if(!this.dataAyuntamiento) return;

    this.dataAyuntamiento.almacenamientoElixir += this.dataElixir.elixirs[i].producionElixir;
    this.dataElixir.elixirs[i].producionElixir = 0;
  }
}
