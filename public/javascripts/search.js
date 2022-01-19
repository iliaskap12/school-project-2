window.addEventListener('load', () => {
  async function asyncCallCourse (keyword) {
    let myHeaders = new Headers();
    let init = {
      method: 'GET',
      headers: myHeaders
    };
    let result = await fetch(
      `https://elearning-aueb.herokuapp.com/courses/search?title=${keyword}`,
      init
    );
    result = await result.json();
    return result;
  }

  async function asyncCallCategories () {
    let myHeaders = new Headers();
    let init = {
      method: 'GET',
      headers: myHeaders
    };
    let result = await fetch(
      `https://elearning-aueb.herokuapp.com/categories`,
      init
    );
    result = await result.json();
    return result;
  }

  function findCategoryTitle (listOfData, listOfCategories) {
    let listOfTitles = new Array(listOfData.length);
    let i = 0;
    for (const data of listOfData) {
      for (const category of listOfCategories) {
        if (data.category === category.id) {
          listOfTitles[i] = category.title;
          i++;
          break;
        }
      }
    }
    return listOfTitles;
  }

  async function asyncCallHandlebars (listOfData, listOfTitles) {
    let result = await fetch('/hbs/search');
    result = await result.text();
    const parser = new DOMParser();
    const template = Handlebars.compile(result);
    let i = 0;
    for (const data in listOfData) {
      const content = {
        title: data.title,
        category: listOfTitles[i].title,
        objectives: data.objectives,
        description: data.description
      };
      document.body.appendChild(
        parser.parseFromString(template(content), 'text/html').body
          .firstElementChild
      );
      i++;
    }
  }

  document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();
    let keyword = document.getElementById('txt-search');
    if (keyword.value.length === 0) {
      keyword.setCustomValidity(
        'Please enter a name or keyword for us to search!'
      );
    } else {
      let responseCourses = asyncCallCourse(keyword.value);
      let responseCategories = asyncCallCategories();
      let categoryTitles = findCategoryTitle(
        responseCourses,
        responseCategories
      );
      let handlebars = asyncCallHandlebars(responseCourses, categoryTitles);
    }
  });
});
