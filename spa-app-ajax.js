(function() {
"use strict";

var DEFAULT_ROUTE = 'home';

var template = document.querySelector('#t');
var ajax, pages, scaffold;
var cache = {};

template.pages = [
  {name: 'Home', hash: 'home', url: 'home.html'},
  {name: 'About', hash: 'about', url: 'about.html'},
  {name: 'Contact', hash: 'contact', url: 'contact.html'},
  {name: 'Sponsor', hash: 'sponsor', url: 'sponsor.html'},
  {name: 'Conduct', hash: 'conduct', url: 'conduct.html'},
  {name: 'Past Events', hash: 'past', url: 'past.html'},
];

template.addEventListener('template-bound', function(e) {
  scaffold = document.querySelector('#scaffold');
  ajax = document.querySelector('#ajax');
  pages = document.querySelector('#pages');
  var keys = document.querySelector('#keys');

  // var docsMenu = document.querySelector('docs-menu');
  // docsMenu.coreElements = {"core-a11y-keys":"components/core-a11y-keys/core-a11y-keys.html","core-ajax":"components/core-ajax/core-ajax.html","core-xhr":"components/core-ajax/core-xhr.html","core-animated-pages":"components/core-animated-pages/core-animated-pages.html","core-transition-pages":"components/core-animated-pages/transitions/core-transition-pages.html","core-animation-group":"components/core-animation/core-animation-group.html","core-animation":"components/core-animation/core-animation.html","core-animation-keyframe":"components/core-animation/core-animation.html","core-animation-prop":"components/core-animation/core-animation.html","core-collapse":"components/core-collapse/core-collapse.html","core-drag-drop":"components/core-drag-drop/core-drag-drop.html","core-drawer-panel":"components/core-drawer-panel/core-drawer-panel.html","core-dropdown-overlay":"components/core-dropdown/core-dropdown-overlay.html","core-dropdown":"components/core-dropdown/core-dropdown.html","core-dropdown-menu":"components/core-dropdown-menu/core-dropdown-menu.html","core-field":"components/core-field/core-field.html","core-header-panel":"components/core-header-panel/core-header-panel.html","core-icon":"components/core-icon/core-icon.html","core-icon-button":"components/core-icon-button/core-icon-button.html","core-iconset":"components/core-iconset/core-iconset.html","core-iconset-svg":"components/core-iconset-svg/core-iconset-svg.html","core-input":"components/core-input/core-input.html","core-item":"components/core-item/core-item.html","core-list":"components/core-list/core-list.html","core-localstorage":"components/core-localstorage/core-localstorage.html","core-media-query":"components/core-media-query/core-media-query.html","core-menu":"components/core-menu/core-menu.html","core-submenu":"components/core-menu/core-submenu.html","core-menu-button":"components/core-menu-button/core-menu-button.html","core-meta":"components/core-meta/core-meta.html","core-overlay":"components/core-overlay/core-overlay.html","core-pages":"components/core-pages/core-pages.html","core-range":"components/core-range/core-range.html","core-scaffold":"components/core-scaffold/core-scaffold.html","core-scroll-header-panel":"components/core-scroll-header-panel/core-scroll-header-panel.html","core-selection":"components/core-selection/core-selection.html","core-selector":"components/core-selector/core-selector.html","core-shared-lib":"components/core-shared-lib/core-shared-lib.html","core-signals":"components/core-signals/core-signals.html","core-splitter":"components/core-splitter/core-splitter.html","core-style":"components/core-style/core-style.html","core-toolbar":"components/core-toolbar/core-toolbar.html","core-tooltip":"components/core-tooltip/core-tooltip.html","core-transition":"components/core-transition/core-transition.html"};
  // docsMenu.paperElements = {"paper-button-base":"components/paper-button/paper-button-base.html","paper-button":"components/paper-button/paper-button.html","paper-checkbox":"components/paper-checkbox/paper-checkbox.html","paper-dialog-transition":"components/paper-dialog/paper-dialog-transition.html","paper-dialog":"components/paper-dialog/paper-dialog.html","paper-dropdown-menu":"components/paper-dropdown-menu/paper-dropdown-menu.html","paper-fab":"components/paper-fab/paper-fab.html","paper-focusable":"components/paper-focusable/paper-focusable.html","paper-icon-button":"components/paper-icon-button/paper-icon-button.html","paper-input":"components/paper-input/paper-input.html","paper-item":"components/paper-item/paper-item.html","paper-menu-button":"components/paper-menu-button/paper-menu-button.html","paper-progress":"components/paper-progress/paper-progress.html","paper-radio-button":"components/paper-radio-button/paper-radio-button.html","paper-radio-group":"components/paper-radio-group/paper-radio-group.html","paper-ripple":"components/paper-ripple/paper-ripple.html","paper-shadow":"components/paper-shadow/paper-shadow.html","paper-slider":"components/paper-slider/paper-slider.html","paper-tab":"components/paper-tabs/paper-tab.html","paper-tabs":"components/paper-tabs/paper-tabs.html","paper-toast":"components/paper-toast/paper-toast.html","paper-toggle-button":"components/paper-toggle-button/paper-toggle-button.html"};


  // Allow selecting pages by num keypad. Dynamically add
  // [1, template.pages.length] to key mappings.
  var keysToAdd = Array.apply(null, template.pages).map(function(x, i) {
    return i + 1;
  }).reduce(function(x, y) {
    return x + ' ' + y;
  });
  keys.keys += ' ' + keysToAdd;

  this.route = this.route || DEFAULT_ROUTE; // Select initial route.
});

template.keyHandler = function(e, detail, sender) {
  // Select page by num key. 
  var num = parseInt(detail.key);
  if (!isNaN(num) && num <= this.pages.length) {
    pages.selectIndex(num - 1);
    return;
  }

  switch (detail.key) {
    case 'left':
    case 'up':
      pages.selectPrevious();
      break;
    case 'right':
    case 'down':
      pages.selectNext();
      break;
    case 'space':
      detail.shift ? pages.selectPrevious() : pages.selectNext();
      break;
  }
};

template.menuItemSelected = function(e, detail, sender) {
  if (detail.isSelected) {

    // Need to wait one rAF so <core-ajax> has it's URL set.
    this.async(function() {
      if (!cache[ajax.url]) {
        ajax.go();
      }

      scaffold.closeDrawer();
    });

  }
};

template.toDate = function(input){
  var m = (new Date(input)).getMonth() + 1;
  var d = (new Date(input)).getDate();
  return  m + "/" +  d;
};

template.toDateDay= function(input){
  var d = (new Date(input)).getDate();
  return d;
};
template.toDateMon= function(input){
  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  var m = monthNames[(new Date(input)).getMonth()];
  return m ;
};


template.toDateDiv = function(input){
  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  var m = monthNames[(new Date(input)).getMonth()];
  var d = (new Date(input)).getDate();
  return '<div class="date"><p>' + d + '<span>' + m + "</span></p></div>" ;
};

template.ajaxLoad = function(e, detail, sender) {
  e.preventDefault(); // prevent link navigation.
};

template.onResponse = function(e, detail, sender) {
  var article = detail.response.querySelector('article');
  var html = article.innerHTML;

  cache[ajax.url] = html; // Primitive caching by URL.

  this.injectBoundHTML(html, pages.selectedItem.firstElementChild);
};

})();


// Hello Developers! See console.
console && console.log(
  "%cWelcome to %cG%cD%cG %cT%cw%ci%cn %cC%ci%ct%ci%ce%cs%c!\n%cThis website code is at https://github.com/GDGTC/gdgtc-site-polymer/",
  "font-size:1.5em;color:#4558c9;",

  "font-size:1.5em;color:#0266C8;",
  "font-size:1.5em;color:#F90101;",
  "font-size:1.5em;color:#F2B50F;",
  "font-size:1.5em;color:#4558c9;",
  "font-size:1.5em;color:#00933B;",

  "font-size:1.5em;color:#0266C8;",
  "font-size:1.5em;color:#F90101;",
  "font-size:1.5em;color:#F2B50F;",
  "font-size:1.5em;color:#4558c9;",
  "font-size:1.5em;color:#00933B;",

  "font-size:1.5em;color:#0266C8;",
  "font-size:1.5em;color:#F90101;",
  "font-size:1.5em;color:#F2B50F;",
  "font-size:1.5em;color:#00933B;",

  "font-size:1em;color:#006600;");


// Analytics for pp.org
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-46026381-1', 'auto');
ga('send', 'pageview');
