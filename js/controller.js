/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class Controller {
  /**
   * Creates Controller
   * @param {View} view   - pointer to View instance
   * @param {Model} model - pointer to Model instance
   */
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  /**
   * Adds event listeners for events from View object.
   * When any navigation control is inserted into the DOM, adds listeners to each item of it.
   */
  init() {
    this.model.init();
    document.addEventListener('categoriesRendered', e => {
      const naviList = this.view.naviList;
      if (naviList.length) {
        for (const element of naviList) {
          element.addEventListener('click', e => {
            if (element.id !== this.view.curCat) {
              const prev = document.querySelector('li[data-category].selected');
              prev.classList.remove('selected');
              this.view.curCat = element.dataset.category;
              element.classList.add('selected');
              this.model.refreshSourcesData();
            }
          });
        }
        this.model.refreshSourcesData();
      }
    });
    document.addEventListener('sourcesRendered', e => {
      const sourceList = this.view.sourceList;
      for (const element of sourceList) {
        element.addEventListener('click', e => {
          if (element.id !== this.view.curSource) {
            const prev = document.querySelector('li[data-source].selected');
            prev.classList.remove('selected');
            this.view.curSource = element.dataset.source;
            element.classList.add('selected');
            this.model.refreshSortOrderData();
          }
        });
      }
      this.model.refreshSortOrderData();
    });

    document.addEventListener('ordersRendered', e => {
      const sortOrder = this.view.sortOrder;
      sortOrder.addEventListener('change', e => {
        this.view.curSort = sortOrder.value;
        this.model.refreshNews(this.view.curSource, sortOrder.value);
      });
      this.model.refreshNews(this.view.curSource, this.view.curSort);
    });
  }
}
