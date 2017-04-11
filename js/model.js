/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class Model {
  /**
   * Creates Model
   * @param {View} view - pointer to View instance
   */
  constructor(view) {
    this.view = view;
    this.api = 'd1702297d6d44aed92f84e13cd0a0122';
    this.staticData = [];
    this.attempts = 5;
  }

  /**
   * Fetches and sets initial data
   */
  init() {
    this.getData('nav')
      .then(data => {
        this.staticData = this.prepareStaticData(data);
        this.view.curCat = this.staticData[0].category;
        this.view.curSource = this.staticData[0].sources[0].id;
        this.view.curSort = this.staticData[0].sources[0].sortBysAvailable[0];
        this.view.categories = this.staticData;
      })
      .catch(e => {
        this.errorHandler(e, 'nav');
      });
  }

  /**
   * Fetching data from News Server
   * @param {string} src - data selector
   * @param args - {string} source and {string} order for fetching news data
   * @returns {Promise.<*>}
   */
  async getData(src, ...args) {
    let url, [source, order] = [...args];

    if (src === 'nav') {
      url = new URL('https://newsapi.org/v1/sources');
      url.searchParams.append('language', 'en');
    }
    else if (src === 'news') {
      url = new URL('https://newsapi.org/v1/articles');
      url.searchParams.append('source', source);
      url.searchParams.append('sortBy', order);
      url.searchParams.append('apiKey', this.api);
    }
    else return Promise.reject(Error('Bad request'));

    try {
      const res = await fetch(url);
      return res.json();
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Error handler. Generates error messages and trying to retry fetching data defined number of times.
   * @param {string} e   - reason
   * @param {string} src - who trow error (news or navigation)
   * @param args         - {string} source and {string} order for fetching news data
   */
  errorHandler(e, src, ...args) {
    let again = (this.attempts > 0) ?
      [
        'Trying to fetch data again. Next attempt will be done after 10 sec.',
        `Attempts left: ${this.attempts}`
      ] :
      ["Sorry! Can't resolve this problem... Try again later..."];
    this.view.newsHolder.innerHTML = Model.renderWarning(['Sorry! The error has occurred on the News Server...', e, ...again]);
    if (this.attempts > 0) setTimeout(() => {
      this.attempts--;
      if (src === 'nav') this.init();
      else {
        const [source, order] = [...args];
        this.refreshNews(source, order);
      }
    }, 10000);
  }

  /**
   * Prepares fetched data for future use
   * @param {object} data - fetched data (navigation static data, called once)
   * @returns {Array} - prepared data
   */
  prepareStaticData(data) {
    const out = [];
    if (data.status === 'ok') {
      const cats = [];
      for (const ns of data.sources) {
        cats.push(ns.category);
      }
      for (const category of [...cats.reduce((a, c) => {
        if (-1 === a.indexOf(c)) a.push(c);
        return a;
      }, [])]) {
        out.push({category, sources: [...data.sources.filter(c => (c.category === category))]});
      }
    }
    else if (data.status === 'error')
      throw new Error(data.message);
    else
      throw new Error('Oops! Something went wrong...');
    return out;
  }

  /**
   * Refreshes data of news sources in dependence of the current category
   * @param {string} category - current category
   */
  refreshSourcesData(category = this.view.curCat) {
    const sources = this.staticData.find(e => e.category === category).sources;
    this.view.curSource = sources[0];
    this.view.sources = sources;
  }

  /**
   * Refreshes data of sort orders in dependence of the current news source
   * @param {string} source - current source
   */
  refreshSortOrderData(source = this.view.curSource) {
    const sortOrders = this.staticData
      .find(e => e.category === this.view.curCat).sources
      .find(e => e.id === source).sortBysAvailable;
    this.view.curSort = sortOrders[0];
    this.view.sortOrders = sortOrders;
  }

  /**
   * Fetches data and refreshes news in dependence of the current source and sort order
   * @param {string} source - current source
   * @param {string} order
   */
  refreshNews(source = this.view.curSource, order = this.view.curSort) {
    this.getData('news', source, order)
      .then(data => {
        if (data.status === 'ok') {
          this.view.news = data;
        }
        else if (data.status === 'error') {
          throw new Error(data.message);
        }
        else {
          throw new Error('Oops! Something went wrong...');
        }
      })
      .catch(e => this.errorHandler(e, 'news', source, order));
  }

  /**
   * Creating tags for outputting error messages
   * @param {Array} text
   * @returns {string}
   */
  static renderWarning(text) {
    let out = '';
    for (const val of text) out += `<p>${val}</p>`;
    return `<div class="warning">${out}</div>`;
  }
}