import Form from '/form';

(() => {
  if (window.sessionStorage.getItem('_id')) {
    window.location.href = '/profile';
  }
})();

window.addEventListener('DOMContentLoaded', () => {
  const signupForm = new Form('sign-up-form', onSubmit);
});

function formatData (element) {
  const data = Object.fromEntries(new FormData(element).entries());
  return {
    address: {
      country: data.country,
      state: data.state,
      city: data.city,
      zip: data['zip-code'],
      street: data['home-address'],
      number: data['home-number']
    },
    account: {
      password: data.password,
      username: data.username
    },
    info: {
      name: {
        first: data['first-name'],
        last: data['last-name']
      },
      age: data.age,
      email: data.email,
      phone: data['phone-number'],
      education: data.education
    }
  };
}

function onSuccess (response, userData) {
  window.sessionStorage.setItem('_id', response.security._id);
  window.sessionStorage.setItem('_token', response.security._token);
  window.sessionStorage.setItem('username', `${userData.account.username}`);
  window.location.href = '/thanks';
}

function onError (response, userData) {
  const error = document.createElement('section');
  error.id = 'registration-failure';
  error.classList.add('error', 'fail');
  const errorMessage = document.createElement('em');
  if (response.error.email) {
    errorMessage.textContent = `Το email: ${
      userData.info.email
    } χρησιμοποιείται ήδη.`;
  } else {
    errorMessage.textContent = `Το username: ${
      userData.account.username
    } χρησιμοποιείται ήδη.`;
  }
  const closeBtnContainer = document.createElement('div');
  const close = document.createElement('button');
  close.classList.add('btn', 'secondary-button');
  close.style.fontSize = '1.1em';
  close.textContent = 'Κλείσιμο';
  close.addEventListener('click', () => {
    const errorBox = document.getElementById('registration-failure');
    errorBox.remove();
  });
  error.appendChild(errorMessage);
  closeBtnContainer.appendChild(close);
  error.appendChild(closeBtnContainer);
  document.body.appendChild(error);
}

async function register (userData) {
  try {
    const response = await fetch('/register', {
      method: 'post',
      body: JSON.stringify({ data: userData }),
      redirect: 'follow',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();
    if (!json.error) {
      onSuccess(json, userData);
    } else {
      onError(json, userData);
    }
  } catch (e) {
    console.error(e);
  }
}

function onSubmit (element) {
  const userData = formatData(element);
  register(userData).catch(e => console.error(e));
}
