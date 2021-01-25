import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DdChildService {

  private loadedChilds: any = [];
  private callbacks: any = {};

  constructor() { }

  register(childScope, name) {
    this.loadedChilds.push({
      name,
      scope: childScope
    });

    if (this.callbacks[name] && this.callbacks[name].legnth) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.callbacks[name].length; i++) {
        const cb = this.callbacks[name][i];
        cb();
      }
      this.callbacks[name] = [];
    }
  }

  isLoaded(name) {
    // tslint:disable-next-line: prefer-const
    for (let item of this.loadedChilds) {
      if (item.name === name) {
        return true;
      }
    }
    return false;
  }

  onLoad(name, callback) {
    if (!this.callbacks[name]) {
      this.callbacks[name] = [];
    }
    this.callbacks[name].push(callback);
  }
}
