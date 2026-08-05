const copyButton = document.querySelector('.copy-button');

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const code = document.querySelector('#bibtex code');
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code.innerText);
      copyButton.textContent = 'Copied';
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 1500);
    } catch {
      copyButton.textContent = 'Select text manually';
    }
  });
}
