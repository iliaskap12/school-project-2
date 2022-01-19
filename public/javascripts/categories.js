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

async function populateCategories () {
  const categories = await getCategories();
  if (categories.error.status) {
    if (categories.error.unknown) {
      console.error(`Unknown Error: ${categories.error.unknown}`);
    } else {
      console.error(
        `Bad Request: URI=${categories.error.uri}, STATUS=${
          categories.error.status
        }`
      );
    }
  }

  const menuHbs = await fetch('/hbs/menu');
  const menuText = await menuHbs.text();
  const parser = new DOMParser();
  const template = Handlebars.compile(menuText);
  document
    .getElementById('header')
    .appendChild(
      parser.parseFromString(template({categories: categories.categories}), 'text/html').body
        .firstElementChild
    );
  Array.from(document.getElementsByClassName('category')).forEach(
    categoryEl => {
      categoryEl.addEventListener('click', onCategoryClick);
    }
  );
}

function onCategoryClick () {
  location.href = '/html/courses.html'
  // fetch(`/courses`, { redirect: 'follow' }).catch(
  //   error => console.error(error)
  // );
}

window.addEventListener('DOMContentLoaded', populateCategories);
