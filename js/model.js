/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class Model {
  constructor(view) {
    this.view = view;
    this.api = 'd1702297d6d44aed92f84e13cd0a0122';
    this.staticData = [];
    this.getInitialData();
  }

  async getInitialData() {
    this.staticData = await this.getData();
    this.view.curCat = this.staticData[0].category;
    this.view.categories = this.staticData;
    this.view.curSource = this.staticData[0].sources[0].id;
    this.view.sources = this.staticData.find(e => e.category === this.staticData[0].category).sources;
    this.view.curSort = this.staticData[0].sources[0].sortBysAvailable[0];
    this.view.sortOrders = this.staticData[0].sources.find(e => e.id === this.staticData[0].sources[0].id).sortBysAvailable;
    this.view.news = await this.getNews(this.staticData[0].sources[0].id, this.staticData[0].sources[0].sortBysAvailable[0]);
  }

  async getData() {
    const
      out = [],
      url = new URL('https://newsapi.org/v1/sources');
    url.searchParams.append('language', 'en');
    try {
      const
        res = await fetch(url),
        data = await res.json();
      if (data.status === 'ok') {
        const cats = [];
        for (const ns of data.sources) {
          cats.push(ns.category);
        }
        for (const val of [...cats.reduce((a, c) => {
          if (-1 === a.indexOf(c)) a.push(c);
          return a;
        }, [])]) {
          out.push({category: val, sources: [...data.sources.filter(c => (c.category === val))]})
        }
      }
    }
    catch (e) {
      console.log(e);
    }
    return out;
  }

  async getNews(source, order) {
    const
      url = new URL('https://newsapi.org/v1/articles');
    url.searchParams.append('source', source);
    url.searchParams.append('sortBy', order);
    url.searchParams.append('apiKey', this.api);
    try {
      const
        r = await fetch(url),
        j = await r.json();
      if (j.status === 'ok') return j;
      else if (j.status === 'error') throw new Error(j.message);
      else throw new Error('Oops! Something went wrong');
    }
    catch (e) {
      console.log(e);
    }
  }

  refreshSourcesData(category = this.view.curCat) {
    const sources = this.staticData.find(e => e.category === category).sources;
    this.view.curSource = sources[0];
    this.view.sources = sources;
  }

  refreshSortOrderData(source = this.view.curSource) {
    const sortOrders = this.staticData
      .find(e => e.category === this.view.curCat).sources
      .find(e => e.id === source).sortBysAvailable;
    this.view.curSort = sortOrders[0];
    this.view.sortOrders = sortOrders;
  }

  async refreshNews(source = this.view.curSource, order = this.view.curSort) {
    this.view.news = await this.getNews(source, order);
  }
}