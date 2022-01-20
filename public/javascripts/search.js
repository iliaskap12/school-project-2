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
  const courses = {
    error: {
      uri: false,
      status: false,
      unknown: false
    },
    keyword: document.getElementById('txt-search').value,
    category: '',
    courses: []
  };

  try {
    let responseUri = await fetch('/courses-uri');
    if (!responseUri.ok) {
      courses.error.uri = '/courses-uri';
      courses.error.status = responseUri.status;
      return courses;
    }
    const coursesUri = await responseUri.json();

    const response = await fetch(`${coursesUri.uri.title}=${courses.keyword}`);
    if (!response.ok) {
      courses.error.uri = `${coursesUri.uri.title}=${courses.keyword}`;
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

    for (const course of courses.courses) {
      courses.category = await getCategoryTitle(course.category);
    }

    return courses;
  } catch (error) {
    courses.error.unknown = error;
    return courses;
  }
}

async function render (courses) {
  const coursesHbs = await fetch('/hbs/search');
  const coursesText = await coursesHbs.text();
  const parser = new DOMParser();
  const template = Handlebars.compile(coursesText);
  const templateData = {
    courses: courses
  };
  if (!templateData) return;
  document
    .getElementById('results')
    .appendChild(
      parser.parseFromString(template(templateData), 'text/html').body
        .firstElementChild
    );
}

async function searchCourses () {
  const courses = await getCourses();
  if (handleError(courses)) {
    return;
  }
  await render(courses);
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form').addEventListener('submit', async e => {
    e.preventDefault();
    let keyword = document.getElementById('txt-search');
    if (keyword.value.length === 0) {
      keyword.setCustomValidity('Παρακαλώ εισάγετε κάποια λέξη-κλειδί.');
    } else {
      await searchCourses();
    }
  });
});
