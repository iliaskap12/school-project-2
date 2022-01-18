window.addEventListener('load', () => {
  async function asyncCall (keyword) {
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

  document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();
    let keyword = document.getElementById('txt_search');
    if (keyword.value.length === 0) {
      keyword.setCustomValidity(
        'Please enter a name or keyword for us to search!'
      );
    } else {
      let response = asyncCall(keyword.value);
    }
  });
});
