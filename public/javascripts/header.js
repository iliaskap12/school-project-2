function setHeaderOffset () {
  const header = document.querySelector('header');
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;
  heroSection.style.paddingTop = `${header.offsetHeight * 1.15}px`;
}

async function render () {
  const headerHbs = await fetch('/hbs/header');
  const headerText = await headerHbs.text();
  const parser = new DOMParser();
  const template = Handlebars.compile(headerText);
  document.body.insertBefore(
    parser.parseFromString(template({}), 'text/html').body.firstElementChild,
    document.body.firstChild
  );
}

window.addEventListener('DOMContentLoaded', async () => {
  await render().catch(e => console.error(e));
  setHeaderOffset();
  /*
   *   Menu button event listener. On click, add open class to required elements and remove close class, or the opposite
   *   depending on the state of the button. Keep the state in a variable and update it on each button click.
   *   Acquire the necessary elements through querySelector and getElementById and store them in const, keep the menu
   *   state values in a JavaScript object.
   */
  const menu_button_toggle = document.getElementById('menu-toggle'),
    button_wrapper = document.querySelector('.button-wrapper'),
    navigation = document.querySelector('.primary-navigation'),
    menu_links = document.querySelectorAll('#primary-menu a[role="menuitem"]'),
    menu_state = { open: 'open', close: 'close' };
  let button_class = menu_state.close;
  button_wrapper.addEventListener('click', () => {
    menu_button_toggle.blur();
    if (menu_button_toggle.classList.contains(menu_state.open)) {
      menu_button_toggle.classList.remove(button_class);
      button_wrapper.classList.remove(button_class);
      navigation.classList.remove(button_class);
      button_class = menu_state.close;
      menu_button_toggle.setAttribute('aria-expanded', 'false');
      navigation.setAttribute('aria-expanded', 'false');
      menu_links.forEach(link => link.setAttribute('tabindex', '-1'));
    } else if (menu_button_toggle.classList.contains(menu_state.close)) {
      menu_button_toggle.classList.remove(button_class);
      button_wrapper.classList.remove(button_class);
      navigation.classList.remove(button_class);
      button_class = menu_state.open;
      menu_button_toggle.setAttribute('aria-expanded', 'true');
      navigation.setAttribute('aria-expanded', 'true');
      menu_links.forEach(link => link.setAttribute('tabindex', '0'));
    }

    void menu_button_toggle.offsetWidth; // delays class modifications and makes them in batch mode for performance boost
    menu_button_toggle.classList.add(button_class);
    button_wrapper.classList.add(button_class);
    navigation.classList.add(button_class);
  });

  menu_button_toggle.addEventListener('focus', event => {
    event.preventDefault();
  });
});
window.addEventListener('resize', setHeaderOffset);
