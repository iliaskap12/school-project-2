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
    console.log(result);
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
    let content = new Array(listOfData.length)
    for (const data of listOfData) {
      content[i] = {
        title: data.title,
        category: listOfTitles[i],
        objectives: data.objectives,
        description: data.description
      };
      i++
    }
    content = { content: content /* <-- array */ };
    console.log(JSON.stringify(content));
    let results = document.getElementsByClassName("results")[0].
      appendChild(
        parser.parseFromString(template({content: content.content}), 'text/html').body
      );
  }

  document.getElementById('form').addEventListener('submit', async e => {
    e.preventDefault();
    let keyword = document.getElementById('txt-search');
    if (keyword.value.length === 0) {
      keyword.setCustomValidity(
        'Please enter a name or keyword for us to search!'
      );
    } else {
      let responseCourses = await asyncCallCourse(keyword.value);
      let responseCategories = await asyncCallCategories();
      let categoryTitles = findCategoryTitle(
        responseCourses,
        responseCategories
      );
      let handlebars = asyncCallHandlebars(responseCourses, categoryTitles);
    }
  });
});
