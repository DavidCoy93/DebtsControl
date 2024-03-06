import { Component, OnInit } from '@angular/core';
import { ExampleModelWithFn, consoleLogObjectToShow } from './models/example-model-with-fn';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DebtsControl';
  algoTonto: ExampleModelWithFn = {
    Nombre: "Algo",
    Edad: 30,
    Concat(callback, args) {
      if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
          callback(i, args[i])
        }
      }
    }
  }

  ngOnInit(): void {
    this.algoTonto.Nombre = "Alberto";
    this.algoTonto.Edad = 40;
    this.algoTonto.Concat((position, value) => {
      
      const objToShow: consoleLogObjectToShow = { Position: position, Valor: value }
      console.log(objToShow);

    }, ["A la mierda", "Que chingue a su madre Jorgito", "Ya me voy a la verga de It-seekers"])
  }

  callbackfnEx = (par1: string | number, par2: string | number):void => {  console.log(par1); console.log(par2)  }
}
