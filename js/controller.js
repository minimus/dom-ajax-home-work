/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.init();
  }

  init() {
    document.addEventListener('categoriesRendered', e => {
      const naviList = this.view.naviList;
      if (naviList.length) {
        for (const element of naviList) {
          element.addEventListener('click', e => {
            if (element.id !== this.view.curCat) {
              const prev = document.querySelector('nav ul li.selected');
              prev.classList.remove('selected');
              this.view.curCat = element.id;
              element.classList.add('selected');
              this.model.refreshSourcesData(element.id);
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
            const prev = document.querySelector('#sidebar ul li.selected');
            prev.classList.remove('selected');
            this.view.curSource = element.id;
            element.classList.add('selected');
            this.model.refreshSortOrderData(element.id);
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
      this.model.refreshNews();
    });
  }
}
