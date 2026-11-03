/* Navigation and theme enhancement; the complete content is in index.html. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var menuButton = document.querySelector('.menu-toggle');
  var navigation = document.getElementById('site-navigation');
  var themeButton = document.querySelector('.theme-toggle');

  function closeMenu() {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }

  menuButton.addEventListener('click', function () {
    var isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  function updateThemeLabel() {
    var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeButton.setAttribute('aria-label', 'Switch to ' + nextTheme + ' theme');
    themeButton.title = 'Switch to ' + nextTheme + ' theme';
  }
  themeButton.hidden = false;
  updateThemeLabel();
  themeButton.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('yuzhe-homepage-theme', root.dataset.theme);
    } catch (error) { /* Storage is optional. */ }
    updateThemeLabel();
  });

  var figureDialog = document.querySelector('.figure-dialog');
  if (figureDialog && typeof figureDialog.showModal === 'function') {
    var largeFigure = figureDialog.querySelector('.figure-dialog-image');
    var figureCaption = figureDialog.querySelector('.figure-dialog-caption');
    var originalOverflow = '';
    document.querySelectorAll('a.publication-figure').forEach(function (link) {
      link.addEventListener('click', function (event) {
        // Preserve normal new-tab and modified-click behavior.
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        var thumbnail = link.querySelector('img');
        largeFigure.src = thumbnail.currentSrc || thumbnail.src;
        largeFigure.alt = thumbnail.alt;
        figureCaption.textContent = thumbnail.alt;
        originalOverflow = document.body.style.overflow;
        figureDialog.showModal();
        document.body.style.overflow = 'hidden';
      });
    });
    figureDialog.querySelector('.figure-dialog-close').addEventListener('click', function () {
      figureDialog.close();
    });
    figureDialog.addEventListener('click', function (event) {
      if (event.target !== figureDialog) return;
      var bounds = figureDialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) {
        figureDialog.close();
      }
    });
    figureDialog.addEventListener('close', function () {
      document.body.style.overflow = originalOverflow;
      largeFigure.removeAttribute('src');
    });
  }
})();
