import { Injectable } from '@angular/core';
import { CookieItem } from '../models/cookie-item';


interface genericObjet {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isFromDashboard: boolean = false;
  constructor() { }


  createACookie(props: Array<CookieItem>): void {
    const today = new Date();
    props.forEach((c, i, a) => {

      const expirationDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + c.expirationHours, today.getMinutes(), today.getSeconds(), today.getMilliseconds())
      
      document.cookie = `${c.propName}=${c.value}; expires=${expirationDate.toUTCString()};`;
    });
  }
  
  getCookies(...props: string[]): Array<CookieItem> {
    let properties: genericObjet = {};
    let storedCookies: Array<CookieItem> = [];
    
    props.forEach((p, i, a) => {
      const value = this.findCookie(p);
      if (value !== '') {
        Object.defineProperty(properties, p, { value: value, enumerable: true  } );
      }
    })

    Object.keys(properties).forEach((pro, ind, arr) => {
      const cookie: CookieItem = { propName: pro, value: properties[pro], expirationHours: 0 }
      storedCookies.push(cookie);
    });

    return storedCookies;
  }

  findCookie(prop: string): string {
    let propValue: string = "";
    if (document.cookie.includes(prop)) {
      const indexProp = document.cookie.indexOf(prop);
      propValue += document.cookie.substring(indexProp)
      const indexEndProp = propValue.indexOf(";")
      propValue = propValue.substring(propValue.indexOf("=") + 1, (indexEndProp === -1) ? undefined : indexEndProp);
    }
    return propValue
  }
}
