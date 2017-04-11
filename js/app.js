/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class App {
  /**
   * Creates instances of View, Model and Controller objects
   */
  constructor() {
    this.view = new View();
    this.model = new Model(this.view);
    this.controller = new Controller(this.view, this.model);
    this.controller.init();
  }
}