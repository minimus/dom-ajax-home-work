/**
 * Created by minimus on 27.03.2017.
 */
(function () {
  if (0 <= window.navigator.userAgent.indexOf('Chrome/57')) {
    let newsSources, categories = [];
    document.addEventListener('DOMContentLoaded', e => {
      const sources = new Request('https://newsapi.org/v1/sources?language=en');
      fetch(sources)
        .then(r => r.json())
        .then(j => {
          if (j.status === 'ok') {
            const cats = [];
            for (const ns of j.sources) {
              cats.push(ns.category);
            }
            categories = cats.reduce((a, c) => {
              if (-1 === a.indexOf(c)) a.push(c);
              return a;
            }, []);
            newsSources = j;
            console.log(JSON.stringify(categories));
          }
          else throw new Error('Something went wrong...');
        })
        .catch(e => {
          console.log(e);
        });
    });
  }
})();