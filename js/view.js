/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class View {
  /**
   * Creates View object
   */
  constructor() {
    this.curCat = '';
    this.curSource = '';
    this.curSort = '';
    this.navi = document.querySelector('nav');
    this.newsHolder = document.querySelector('#news-data');
    this.categoriesRenderedEvent = new CustomEvent('categoriesRendered');
    this.sourcesRenderedEvent = new CustomEvent('sourcesRendered');
    this.ordersRenderedEvent = new CustomEvent('ordersRendered');
  }

  /**
   * Getter of categories control. Returns NodeList of Categories Control items
   * @returns {NodeList}
   */
  get naviList() {
    return document.querySelectorAll('nav ul li');
  }

  /**
   * Getter of sources control. Returns NodeList of Sources Control items
   * @returns {NodeList}
   */
  get sourceList() {
    return document.querySelectorAll('#sidebar ul li');
  }

  /**
   * Getter of Sort Order control
   * @returns {Element}
   */
  get sortOrder() {
    return document.querySelector('#sortOrder');
  }

  /**
   * Setter of categories data.
   * Changing this property triggers cascading changes in low level elements (sources, sort order, news).
   * @param {Array} value
   */
  set categories(value) {
    this.renderCategories(value, this.curCat);
  }

  /**
   * Setter of sources data.
   * Changing this property triggers cascading changes in low level elements (sort order, news).
   * @param {Array} value
   */
  set sources(value) {
    this.renderSources(value);
  }

  /**
   * Setter of Sort Orders data.
   * Changing this property triggers cascading changes in low level element (news).
   * @param {Array} value
   */
  set sortOrders(value) {
    this.renderSortOrder(value);
  }

  /**
   * Setter of News data
   * @param {Array} value
   */
  set news(value) {
    this.renderNews(value);
  }

  /**
   * Generates tags of Categories Control
   * @param {Array} categories
   * @param {string} curCat - current category
   */
  renderCategories(categories, curCat) {
    let nav = '';

    nav += '<ul>';
    for (const cat of categories) {
      nav += `<li id='${cat.category}' ${(cat.category === curCat) ? "class='selected'" : ''}>${cat.category.replace(/-/g, ' ')}</li>`;
    }
    nav += '</ul>';
    this.navi.innerHTML = nav;
    document.dispatchEvent(this.categoriesRenderedEvent);
  }

  /**
   * Generates tags of Sources Control
   * @param {Array} sources
   */
  renderSources(sources) {
    const sidebar = document.querySelector('#sidebar');
    let out = '<ul>';
    this.curSource = sources[0].id;
    for (const val of sources) {
      let logo = `https://icons.better-idea.org/icon?url=${val.url}&size=120`;
      out += `<li id="${val.id}" ${(val.id === this.curSource) ? 'class="selected"' : ''} title="${val.description}">`;
      out += `<span><img src="${logo}"></span>`;
      out += `<p>${val.name}</p>`;
      out += '</li>';
    }
    out += '</ul>';
    sidebar.innerHTML = out;
    document.dispatchEvent(this.sourcesRenderedEvent);
  }

  /**
   * Generates tags of Sort Orders Control
   * @param {Array} sorts
   */
  renderSortOrder(sorts) {
    const order = document.querySelector('#order');
    let out = '';
    if (-1 === sorts.indexOf(this.curSort)) this.curSort = sorts[0];
    out += '<label for="sortOrder">Sort by </label>';
    out += '<select id="sortOrder">';
    for (const val of sorts) {
      out += `<option ${(val === this.curSort) ? 'selected' : ''} value="${val}">${val}</option>`;
    }
    out += '</select>';
    order.innerHTML = out;
    document.dispatchEvent(this.ordersRenderedEvent);
  }

  /**
   * Generates News Pane
   * @param {Array} data - news data
   */
  renderNews(data) {
    let out = '';
    for (const article of data.articles) {
      out += this.renderNewsItem(article);
    }
    this.newsHolder.innerHTML = out;
  }

  /**
   * Generates news item tags
   * @param {object} itemData - item data from source
   * @returns {string}        - tags
   */
  renderNewsItem(itemData) {
    let
      out = '',
      imageURL = (itemData.urlToImage) ? itemData.urlToImage : 'images/no-image.png',
      publishDate = new Date(itemData.publishedAt).toLocaleDateString(),
      author = (itemData.author) ?
        ` <i class="material-icons news-author">face</i> <span class="art-info">${itemData.author}</span>` :
        '',
      description = View.shortenText(itemData.description, 50);

    out += '<div class="news-article">';
    out += '<div class="news-image">';
    out += `<a href="${itemData.url}"><img src="${imageURL}"></a>`;
    out += '</div>';
    out += '<div class="info">';
    out += `<a href="${itemData.url}"><h1>${itemData.title}</h1></a>`;
    out += '<p class="info-line">';
    out += `<i class="material-icons news-date">schedule</i> <span class="art-info">${publishDate}</span>`;
    out += author;
    out += "</p>";
    out += `<p>${description}</p>`;
    out += `<p><a href="${itemData.url}">Read More...</a></p>`;
    out += '</div>';
    out += '</div>';

    return out;
  }

  /**
   * Just creates an excerpt of very long description consisting of defined number of words
   * @param {string} text - original news description
   * @param {number} num  - number of words in the excerpt
   * @returns {string} - description or excerpt if needed
   */
  static shortenText(text, num) {
    if (text) {
      const out = text.split(' ');
      if (num < out.length) return `${out.slice(0, num).join(' ')}...`;
      else return text;
    }
  }
}
