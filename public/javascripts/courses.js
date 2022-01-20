import { getCategories, handleError } from './categories.js';

async function getCategoryTitle (categoryId) {
  const categories = await getCategories();
  if (handleError(categories)) {
    return { title: '' };
  }
  for (const category of categories.categories) {
    if (parseInt(categoryId) === parseInt(category.id)) {
      return category.title;
    }
  }
  return { title: '' };
}

async function getCourses () {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const title = await getCategoryTitle(category);

  const courses = {
    error: {
      uri: false,
      status: false,
      unknown: false
    },
    id: category,
    category: title,
    courses: []
  };

  if (!courses.category) {
    courses.error.unknown = 'Η κατηγορία δεν βρέθηκε.';
    return courses;
  }

  try {
    let responseUri = await fetch('/courses-uri');
    if (!responseUri.ok) {
      courses.error.uri = '/courses-uri';
      courses.error.status = responseUri.status;
      return courses;
    }
    const coursesUri = await responseUri.json();

    const response = await fetch(`${coursesUri.uri.id}=${courses.id}`);
    if (!response.ok) {
      courses.error.uri = `${coursesUri.uri.id}=${courses.id}`;
      courses.error.status = response.status;
      return courses;
    }
    courses.courses = await response.json();

    responseUri = await fetch('/images-uri');
    if (!responseUri.ok) {
      courses.error.uri = responseUri.uri;
      courses.error.status = responseUri.status;
      return courses;
    }
    const imagesUrl = await responseUri.json();
    courses.url = imagesUrl.uri;

    return courses;
  } catch (error) {
    courses.error.unknown = error;
    return courses;
  }
}

async function render (courses) {
  const coursesHbs = await fetch('/hbs/courses');
  const coursesText = await coursesHbs.text();
  const parser = new DOMParser();
  const template = Handlebars.compile(coursesText);
  const templateData = {
    courses: courses
  };
  document
    .getElementById('main')
    .appendChild(
      parser.parseFromString(template(templateData), 'text/html').body
        .firstElementChild
    );
}

(async () => {
  const courses = await getCourses();
  if (handleError(courses)) {
    return;
  }
  await render(courses);
})();
