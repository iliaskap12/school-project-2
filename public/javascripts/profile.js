import Form from '/form';

window.addEventListener('DOMContentLoaded', async () => {
  const login = document.getElementById('login-container');
  const logout = document.getElementById('logout');
  logout.addEventListener('click', async () => {
    const result = await fetch('/logout', {
      method: 'post',
      body: JSON.stringify({
        data: {
          _security: {
            _id: window.sessionStorage.getItem('_id'),
            _token: window.sessionStorage.getItem('_token')
          },
          _id: window.sessionStorage.getItem('_id')
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const json = await result.json();
    if (json.success) {
      window.sessionStorage.clear();
      window.location.href = '/profile';
    } else {
      onError(result, result.data);
    }
  });

  document.getElementById('goback').addEventListener('click', () => {
    window.location.href = '/';
  });
  if (window.sessionStorage.getItem('_id')) {
    try {
      const result = await getProfile({
        _id: window.sessionStorage.getItem('_id'),
        _security: {
          _id: window.sessionStorage.getItem('_id'),
          _token: window.sessionStorage.getItem('_token')
        }
      });
      if (result.result.success) {
        login.remove();
        return;
      } else {
        window.sessionStorage.clear();
      }
    } catch (e) {
      console.error(e);
    }
  }
  logout.style.display = 'none';
  const form = new Form('login-form', onSubmit);
});

function formatData (element) {
  return Object.fromEntries(new FormData(element).entries());
}

function onLoginSuccess (response, userData) {
  window.sessionStorage.setItem('_id', userData._security._id);
  window.sessionStorage.setItem('_token', userData._security._token);
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
      onLoginSuccess(json, json.result.data);
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
      renderProfile(json.result.data.data).catch(e => console.error(e));
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
