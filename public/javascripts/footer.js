async function renderFooter () {
  const footerHbs = await fetch('/hbs/footer');
  const footerText = await footerHbs.text();
  const parser = new DOMParser();
  const template = Handlebars.compile(footerText);
  document.body.appendChild(
    parser.parseFromString(template({}), 'text/html').body.firstElementChild
  );
}

window.addEventListener('DOMContentLoaded', async () => {
  await renderFooter().catch(e => console.error(e));
});
