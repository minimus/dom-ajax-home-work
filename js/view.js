/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
class View {
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

  get naviList() {
    return document.querySelectorAll('nav ul li');
  }

  get sourceList() {
    return document.querySelectorAll('#sidebar ul li');
  }

  get sortOrder() {
    return document.querySelector('#sortOrder');
  }

  set categories(value) {
    this.renderCategories(value, this.curCat);
  }

  set sources(value) {
    this.renderSources(value);
  }

  set sortOrders(value) {
    this.renderSortOrder(value);
  }

  set news(value) {
    this.renderNews(value);
  }

  renderCategories(categories, curCat) {
    let nav = '';

    nav += '<ul>';
    for (const cat of categories) {
      nav += `<li id='${cat.category}' ${(cat.category === curCat) ? "class='selected'" : ''}>${cat.category.replace(/-/g, ' ')}</li>`;
    }
    nav += '</ul>';
    this.navi.innerHTML = nav;
    const naviList = document.querySelectorAll('nav ul li');
    if (naviList.length) {
      for (const element of naviList) {
        element.addEventListener('click', e => {
          const prev = document.querySelector(`nav ul li#${curCat}`);
          prev.classList.remove('selected');
          curCat = element.id;
          element.classList.add('selected');
        });
      }
    }
    document.dispatchEvent(this.categoriesRenderedEvent);
  }

  renderSources(sources) {
    const sidebar = document.querySelector('#sidebar');
    let out = '<ul>';
    this.curSource = sources[0].id;
    for (const val of sources) {
      out += `<li id="${val.id}" ${(val.id === this.curSource) ? 'class="selected"' : ''} title="${val.description}">
<span><img src="${val.urlsToLogos.small}"></span><p>${val.name}</p></li>`;
    }
    out += '</ul>';
    sidebar.innerHTML = out;
    document.dispatchEvent(this.sourcesRenderedEvent);
  }

  renderSortOrder(sorts) {
    const /*sorts = data.find(e => e.id === source).sortBysAvailable,*/ order = document.querySelector('#order');
    let out = '<label for="sortOrder">Sort by</label> <select id="sortOrder">';
    if (-1 === sorts.indexOf(this.curSort)) this.curSort = sorts[0];
    for (const val of sorts) {
      out += `<option ${(val === this.curSort) ? 'selected' : ''} value="${val}">${val}</option>`;
    }
    out += '</select>';
    order.innerHTML = out;
    document.dispatchEvent(this.ordersRenderedEvent);
  }

  renderNews(data) {
    let out = '';
    for (const article of data.articles) {
      out += `<div class='news-article'><div class="news-image"><a href="${article.url}"><img src="${article.urlToImage}"></a></div>`;
      out += `<div class="info"><a href="${article.url}"><h1>${article.title}</h1></a>`;
      out += `<p class="info-line"><i class="material-icons news-date">schedule</i> <span class="art-info">${new Date(article.publishedAt).toLocaleDateString()}</span>`;
      out += (article.author) ? ` <i class="material-icons news-author">face</i> <span class="art-info">${article.author}</span></p>` : "</p>";
      out += `<p>${article.description}</p><p><a href="${article.url}">Read More...</a></p></div>`;
      out += '</div>'
    }
    this.newsHolder.innerHTML = out;
  }
}
