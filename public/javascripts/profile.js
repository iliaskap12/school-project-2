import Form from '/form';

window.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('logout').addEventListener('click', logout);
  document.getElementById('goback').addEventListener('click', () => {
    window.location.href = '/';
  });

  await loadProfile();
});

async function loadProfile () {
  if (
    window.sessionStorage.getItem('_id') &&
    window.sessionStorage.getItem('sessionId')
  ) {
    try {
      const result = await getProfile({
        user: {
          _id: window.sessionStorage.getItem('_id')
        },
        sessionId: window.sessionStorage.getItem('sessionId')
      });
      if (result.result.success) {
        document.getElementById('login-container').remove();
        return;
      } else {
        window.sessionStorage.clear();
      }
    } catch (e) {
      console.error(e);
    }
  }
  document.getElementById('logout').style.display = 'none';
  const form = new Form('login-form', onSubmit);
}

async function logout () {
  if (!window.sessionStorage.getItem('sessionId')) {
    window.sessionStorage.clear();
    window.location.href = '/profile';
    return;
  }
  const result = await fetch('/logout', {
    method: 'post',
    body: JSON.stringify({
      sessionId: window.sessionStorage.getItem('sessionId')
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  await result.json();
  window.sessionStorage.clear();
  window.location.href = '/profile';
}

function formatData (element) {
  return Object.fromEntries(new FormData(element).entries());
}

function onLoginSuccess (response) {
  window.sessionStorage.setItem('sessionId', response.sessionId);
  window.sessionStorage.setItem('_id', response.user._id);
  document.getElementById('login-container').remove();
}

function onError (response, userData) {
  const error = document.createElement('section');
  error.id = 'login-failure';
  error.classList.add('error', 'fail');
  const errorMessage = document.createElement('em');
  errorMessage.textContent = userData;
  const closeBtnContainer = document.createElement('div');
  const close = document.createElement('button');
  close.classList.add('btn', 'secondary-button');
  close.style.fontSize = '1.1em';
  close.textContent = 'Κλείσιμο';
  close.addEventListener('click', () => {
    const errorBox = document.getElementById('login-failure');
    errorBox.remove();
  });
  error.appendChild(errorMessage);
  closeBtnContainer.appendChild(close);
  error.appendChild(closeBtnContainer);
  document.body.appendChild(error);
}

async function login (userData) {
  try {
    const response = await fetch('/profile', {
      method: 'post',
      body: JSON.stringify({ data: userData }),
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();
    if (json.result.success) {
      onLoginSuccess(json.result.data);
    } else {
      onError(json, json.result.data);
    }
    return json.result;
  } catch (e) {
    console.error(e);
  }
}

async function getProfile (userData) {
  try {
    const response = await fetch('/get-profile', {
      method: 'post',
      body: JSON.stringify({ data: userData }),
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();
    if (json.result.success) {
      renderProfile(json.result.data).catch(e => console.error(e));
      document.getElementById('logout').style.display = 'block';
    } else {
      onError(json, json.result.data);
    }
    return json;
  } catch (e) {
    console.error(e);
  }
}

async function onSubmit (element) {
  const userData = formatData(element);
  try {
    const loginResult = await login(userData);
    if (loginResult.success) {
      getProfile(loginResult.data)
        .then(res => console.log(res))
        .catch(e => console.error(e));
    }
  } catch (e) {
    console.error(e);
  }
}

async function renderProfile (profile) {
  const profileHbs = await fetch('/hbs/profile');
  const profileText = await profileHbs.text();
  const parser = new DOMParser();
  const template = Handlebars.compile(profileText);
  const templateData = {
    profile: profile
  };
  document
    .getElementsByTagName('main')[0]
    .appendChild(
      parser.parseFromString(template(templateData), 'text/html').body
        .firstElementChild
    );
}
