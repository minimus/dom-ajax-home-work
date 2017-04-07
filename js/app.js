/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class App {
  constructor() {
    if (App.checkBrowser()) {
      this.view = new View();
      this.model = new Model(this.view);
      this.controller = new Controller(this.view, this.model);
    }
  }

  static checkBrowser() {
    const match = window.navigator.userAgent.match(/(?:Chrome\/)(\d+)/);
    return (match && 57 <= parseInt(match[1], 10));
  }
}