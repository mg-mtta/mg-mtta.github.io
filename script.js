(() => {
  'use strict';
  const conditionButtons = [...document.querySelectorAll('[data-result-condition]')];
  const chart = document.querySelector('#benchmark-bars');

  function selectCondition(condition) {
    if (!Object.hasOwn(MG_BENCHMARK.captions, condition) || !chart) return;
    const methods = MG_BENCHMARK.methods;
    const rows = [...chart.querySelectorAll('.bar-row')];
    methods.forEach((method, index) => {
      const row = rows[index];
      if (!row) return;
      row.querySelector('.bar-fill').style.setProperty('--score', `${method[condition]}%`);
      row.querySelector('.bar-value').textContent = method[condition].toFixed(2);
    });
    chart.setAttribute('aria-label', `${condition === 'textual' ? 'Textual' : 'Joint'} shift accuracy: ${methods.map(m => `${m.name} ${m[condition].toFixed(2)}`).join(', ')} percent.`);
    conditionButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.resultCondition === condition)));
    const source = methods[0][condition];
    const entropy = methods[1][condition];
    const ours = methods.at(-1)[condition];
    document.querySelector('#benchmark-gain').textContent = `+${(ours - source).toFixed(2)}`;
    document.querySelector('#benchmark-summary').textContent = `${source.toFixed(2)}% → ${ours.toFixed(2)}%\n+${(ours - entropy).toFixed(2)} pp vs. Entropy-only`;
    document.querySelector('#benchmark-caption').textContent = MG_BENCHMARK.captions[condition];
  }

  if (typeof MG_BENCHMARK !== 'undefined' && chart) {
    conditionButtons.forEach((button, index) => {
      button.disabled = false;
      button.addEventListener('click', () => selectCondition(button.dataset.resultCondition));
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = event.key === 'ArrowLeft' ? index - 1 : index + 1;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = conditionButtons.length - 1;
        const target = conditionButtons[(next + conditionButtons.length) % conditionButtons.length];
        target.focus();
        selectCondition(target.dataset.resultCondition);
      });
    });
  }

  const menu = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (menu && nav) {
    document.documentElement.classList.add('js-enabled');
    menu.hidden = false;
    const setMenu = open => {
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    };
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menu.focus();
      }
    });
    window.matchMedia('(min-width: 601px)').addEventListener('change', () => setMenu(false));
  }

  const dialog = document.querySelector('#figure-dialog');
  const openFigure = document.querySelector('[data-open-figure]');
  if (dialog && openFigure && typeof dialog.showModal === 'function') {
    openFigure.hidden = false;
    openFigure.addEventListener('click', () => dialog.showModal());
    document.querySelector('#close-figure').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  }

  const copyButton = document.querySelector('#copy-citation');
  const citation = document.querySelector('#bibtex code');
  const copyStatus = document.querySelector('#copy-status');
  let copyTimeout;
  if (copyButton && citation && copyStatus) {
    copyButton.addEventListener('click', async () => {
      clearTimeout(copyTimeout);
      const text = citation.textContent.trim();
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch { /* Try a local clipboard fallback below. */ }
      if (!copied) {
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.append(field);
        field.select();
        try { copied = document.execCommand('copy'); } catch { copied = false; }
        field.remove();
        copyButton.focus({ preventScroll: true });
      }
      if (copied) {
        copyStatus.textContent = 'Citation copied';
        copyTimeout = setTimeout(() => { copyStatus.textContent = ''; }, 3500);
      } else {
        const range = document.createRange();
        range.selectNodeContents(citation);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copyStatus.textContent = 'Text selected — press Ctrl/Cmd+C';
      }
    });
  }
})();
