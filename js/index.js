/**
 * Created by Константин on 06.04.2017.
 */
'use strict';
(function () {
  document.addEventListener('DOMContentLoaded', e => {
    const match = window.navigator.userAgent.match(/(?:Chrome\/)(\d+)/);
    if (match && 57 <= parseInt(match[1], 10)) {
      const application = new App();
    }
    else {
      const newsHolder = document.querySelector('#news-data');
      let out = '';
      out += '<p>This application is available only for Google Chrome 57+!</p>';
      out += '<p>Please, try again using valid browser!</p>';
      newsHolder.innerHTML = `<div class="warning">${out}</div>`;
    }
  });
})();
