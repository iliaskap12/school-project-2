async function getCategories () {
  const categories = {
    error: {
      uri: false,
      status: false,
      unknown: false
    },
    categories: []
  };

  try {
    const responseUri = await fetch('/categories-uri');
    if (!responseUri.ok) {
      categories.error.uri = '/categories-uri';
      categories.error.status = responseUri.status;
      return categories;
    }
    const categoriesUri = await responseUri.json();

    const response = await fetch(categoriesUri.uri);
    if (!response.ok) {
      categories.error.uri = categoriesUri.uri;
      categories.error.status = response.status;
      return categories;
    }
    categories.categories = await response.json();
    return categories;
  } catch (error) {
    categories.error.unknown = error;
    return categories;
  }
}

async function render (categories) {
  const menuHbs = await fetch('/hbs/menu');
  const menuText = await menuHbs.text();
  const parser = new DOMParser();
  const template = Handlebars.compile(menuText);
  const header = document.getElementById('header');
  if (!header) {
    return;
  }
  header.appendChild(
    parser.parseFromString(
      template({ categories: categories.categories }),
      'text/html'
    ).body.firstElementChild
  );
  Array.from(document.getElementsByClassName('category')).forEach(
    categoryEl => {
      categoryEl.addEventListener('click', onCategoryClick);
    }
  );
}

function onCategoryClick () {
  fetch(`/courses?category=${this.id}`, { redirect: 'follow' })
    .then(response => (location.href = response.url))
    .catch(error => console.error(error));
}

(async () => {
  const categories = await getCategories();
  if (handleError(categories)) {
    return;
  }
  await render(categories);
})();

function handleError (obj) {
  if (obj.error.status) {
    if (obj.error.unknown) {
      console.error(`Unknown Error: ${obj.error.unknown}`);
    } else {
      console.error(
        `Bad Request: URI=${obj.error.uri}, STATUS=${obj.error.status}`
      );
    }
    return true;
  }
  return false;
}

export { getCategories, handleError };
