import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  private ayuntamiento: BehaviorSubject<any> = new BehaviorSubject<any>({
    nivel: 1,
    almacenamientoOro: 0,
    almacenamientoElixir: 0,
    maximaCantidadMinaNivel: 2,
    maximaCantidadMinaTotal: 5,
    maximaNivelMina: 2,
    maximaNivelMinaTotal: 5,

    maximaCantidadElixirNivel: 2,
    maximaCantidadElixirTotal: 5,
    maximaNivelElixir: 2,
    maximaNivelElixirTotal: 5,

    maximaCantidadCuartelNivel: 2,
    maximaCantidadCuartelTotal: 5,
    maximaNivelCuartel: 2,
    maximaNivelCuartelTotal: 5,

    tropas: 0
  });

  private mina: BehaviorSubject<any> = new BehaviorSubject<any>({
    isMina: false,
    cantidadMinas: 0,
    minas: [
      /*{
        nivel: 1,
        producionOro: 0,
        velocidadProduccion: 0.1
      }*/
    ]
  });

  private elixir: BehaviorSubject<any> = new BehaviorSubject<any>({
    isElixir: false,
    cantidadElixirs: 0,
    elixirs: [
      /*{
        nivel: 1,
        producionElixir: 0,
        velocidadProduccion: 0.1
      }*/
    ]
  });

  private cuartel: BehaviorSubject<any> = new BehaviorSubject<any>({
    isCuartel: false,
    cantidadCuartel: 0,
    cuarteles: [
      /*{
        nivel: 1,
        tropasColas: 0,
      }*/
    ]
  });
  
  public get ayuntamientoObservable() : Observable<any> {
    return this.ayuntamiento.asObservable();
  }

  public get ayuntamientoValue() :any {
    return this.ayuntamiento.getValue();
  }

  public atualizarAyuntamiento(value: any) {
    this.ayuntamiento.next(value);
  }

  public get minaObservable() : Observable<any> {
    return this.mina.asObservable();
  }

  public get minaValue() : any {
    return this.mina.getValue();
  }

  public atualizarMina(value: any) {
    this.mina.next(value);
  }

  public get elixirObservable() : Observable<any> {
    return this.elixir.asObservable();
  }

  public get elixirValue() : any {
    return this.elixir.getValue();
  }

  public atualizarElixir(value: any) {
    this.elixir.next(value);
  }
  
  public get cuartelObservable() : Observable<any> {
    return this.cuartel.asObservable();
  }

  public get cuartelValue() : any {
    return this.cuartel.getValue();
  }

  public atualizarCuartel(value: any) {
    this.cuartel.next(value);
  }
  
  constructor() {
    this.producionMinas();
    this.producionTropas();
   }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  producionMinas() {
    interval(10000)
    .subscribe((x) => {
      this.minaValue.minas.forEach((element: any) => {
        element.producionOro += element.velocidadProduccion * 10;
      });
      this.atualizarMina(this.minaValue);

      this.elixirValue.elixirs.forEach((element: any) => {
        element.producionElixir += element.velocidadProduccion * 10;
      });
      this.atualizarElixir(this.elixirValue);

      this.cuartelValue.cuarteles.forEach((element: any) => {
        element.tropasColas--;
      });
      this.atualizarCuartel(this.cuartelValue);
    })
  }

  producionTropas() {
    interval(2000)
    .subscribe((x) => {
      this.cuartelValue.cuarteles.forEach((element: any) => {
        if(element.tropasColas >= 1) {
          element.tropasColas--;
          this.ayuntamientoValue.tropas++;
        }
      });
      this.atualizarCuartel(this.cuartelValue);
      this.atualizarAyuntamiento(this.ayuntamientoValue);
    })
  }

}
