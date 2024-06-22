import { Component } from '@angular/core';
import { HandlerService } from '../services/handler.service';

@Component({
  selector: 'app-mina',
  templateUrl: './mina.component.html',
  styleUrl: './mina.component.css'
})
export class MinaComponent {
  public dataAyuntamiento: any;
  public dataMina: any;

  constructor(private handle: HandlerService) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.handle
      .minaObservable
      .subscribe(data => {
        this.dataMina = data;
      });
    
    this.handle
      .ayuntamientoObservable
      .subscribe(data => {

        this.dataAyuntamiento = data;
      })
  }

  public updateNivel(i: number) {
    if(!this.dataMina) return;
    if(!this.dataMina.minas || !this.dataMina.minas.length) return;

    if(this.dataMina.minas[i].nivel < this.dataAyuntamiento.maximaNivelMina) {
      this.dataMina.minas[i].nivel++;
      this.dataMina.minas[i].velocidadProduccion *= this.dataMina.minas[i].nivel;
    }
  }

  public agregarMina() {
    if(!this.dataMina) return;
    if(!this.dataAyuntamiento || !this.dataAyuntamiento.maximaCantidadMinaNivel) return;

    if(this.dataMina.cantidadMinas < this.dataAyuntamiento.maximaCantidadMinaNivel) {
      this.dataMina.cantidadMinas++;
      this.dataMina.minas.push(
        {
          nivel: 1,
          producionOro: 0,
          velocidadProduccion: 0.1
        }
      );
      this.handle.atualizarMina(this.dataMina);
    }
  }

  public recogerOro(i: number) {
    if(!this.dataMina) return;
    if(!this.dataMina.minas || !this.dataMina.minas.length) return;
    if(!this.dataAyuntamiento) return;

    this.dataAyuntamiento.almacenamientoOro += this.dataMina.minas[i].producionOro;
    this.dataMina.minas[i].producionOro = 0;
  }
}
