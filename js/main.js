/**
 * Created by minimus on 27.03.2017.
 */
(function () {
  function fetchNewsData(source, order) {
    let
      url = `https://newsapi.org/v1/articles?source=${source}&sortBy=${order}&apiKey=d1702297d6d44aed92f84e13cd0a0122`,
      out = '';
    const news = new Request(url), newsHolder = document.querySelector('#news-data');
    fetch(news)
      .then(r => r.json())
      .then(j => {
        if (j.status === 'ok') {
          for (const article of j.articles) {
            out += `<div class='news-article'><div class="news-image"><a href="${article.url}"><img src="${article.urlToImage}"></a></div>`;
            out += `<div class="info"><a href="${article.url}"><h1>${article.title}</h1></a>`;
            out += `<p class="info-line"><i class="material-icons news-date">schedule</i> <span class="art-info">${new Date(article.publishedAt).toLocaleDateString()}</span>`;
            out += (article.author) ? ` <i class="material-icons news-author">face</i> <span class="art-info">${article.author}</span></p>` : "</p>";
            out += `<p>${article.description}</p><p><a href="${article.url}">Read More...</a></p></div>`;
            out += '</div>'
          }
          newsHolder.innerHTML = out;
        }
        else throw new Error('Oops! Something went wrong');
      })
      .catch(e => {
        console.log(e);
      });
  }

  function drawNewsSort(source, data) {
    const sorts = data.find(e => e.id === source).sortBysAvailable, order = document.querySelector('#order');
    let out = '<label for="sortOrder">Sort by</label> <select id="sortOrder">';
    if (-1 === sorts.indexOf(curSort)) curSort = sorts[0];
    for (const val of sorts) {
      out += `<option ${(val === curSort) ? 'selected' : ''} value="${val}">${val}</option>`;
    }
    out += '</select>';
    order.innerHTML = out;
    let sortOrder = order.querySelector('#sortOrder');
    sortOrder.addEventListener('change', e => {
      curSort = sortOrder.value;
      fetchNewsData(curSource, curSort);
    });
    fetchNewsData(curSource, curSort);
  }

  function drawNewsSources(category, data) {
    const sources = data.find(e => e.category === category).sources, sidebar = document.querySelector('#sidebar');
    let out = '<ul>';
    curSource = sources[0].id;
    for (const val of sources) {
      out += `<li id="${val.id}" ${(val.id === curSource) ? 'class="selected"' : ''}><img src="${val.urlsToLogos.small}"><p>${val.name}</p></li>`
    }
    out += '</ul>';
    sidebar.innerHTML = out;
    const srcs = document.querySelectorAll('#sidebar ul li');
    if (srcs.length) {
      for (const el of srcs) {
        el.addEventListener('click', e => {
          const prev = sidebar.querySelector(`li#${curSource}`);
          prev.classList.remove('selected');
          curSource = el.id;
          el.classList.add('selected');
          drawNewsSort(el.id, sources);
        });
      }
    }
    drawNewsSort(curSource, sources);
  }

  let content = '', nav = '', sidebar = '', curCat = 'general', curSource = 'abc-news-au', curSort = 'top';
  // Checking for valid browsers: Chrome 57+
  if (57 <= parseInt(window.navigator.userAgent.match(/(?:Chrome\/)(\d+)/)[1], 10)) {
    let categories = [];
    document.addEventListener('DOMContentLoaded', e => {
      const sources = new Request('https://newsapi.org/v1/sources?language=en');
      // Building a list of categories and their sources
      fetch(sources)
        .then(r => r.json())
        .then(j => {
          if (j.status === 'ok') {
            const cats = [];
            for (const ns of j.sources) {
              cats.push(ns.category);
            }
            for (const val of [...cats.reduce((a, c) => {
              if (-1 === a.indexOf(c)) a.push(c);
              return a;
            }, [])]) {
              categories.push({category: val, sources: [...j.sources.filter(c => (c.category === val))]})
            }

            nav += '<ul>';
            for (const cat of categories) {
              nav += `<li id='${cat.category}'${(cat.category === curCat) ? " class='selected'" : ''}>${cat.category.replace(/-/g, ' ')}</li>`;
            }
            nav += '</ul>';
            const navi = document.querySelector('nav');
            navi.innerHTML = nav;
            const naviList = document.querySelectorAll('nav ul li');
            if (naviList.length) {
              for (const element of naviList) {
                element.addEventListener('click', e => {
                  const prev = document.querySelector(`nav ul li#${curCat}`);
                  prev.classList.remove('selected');
                  curCat = element.id;
                  element.classList.add('selected');
                  drawNewsSources(curCat, categories);
                });
              }
            }
            drawNewsSources(curCat, categories);
          }
          else throw new Error('Something went wrong...');
        })
        .catch(e => {
          console.log(e);
        });
    });
  }
})();