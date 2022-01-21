/*
 * custom required (data-required)
 * custom exact number (data-min === data-max)
 * custom range (data-min, data-max)
 * password strength (length, pattern)
 * password match
 * required (valueMissing)
 * type match (typeMismatch, badInput)
 * length (tooShort, tooLong)
 * range (rangeUnderflow, rangeOverflow) / (min, max)
 * stepMismatch
 * patternMismatch (data-pattern-message)
 * customError
 * */

'use strict';

function CustomRestrictions () {
  this.required = null;
  this.min = null;
  this.max = null;
}

class Form {
  static labeledTypes = {
    input: 'input',
    textarea: 'textarea',
    select: 'select'
  };
  #_formID;
  #_formElement;
  #_formControls = [];
  #_onSubmit;

  constructor (formID, onSubmit) {
    this.#_formID = formID;
    this.#_onSubmit = onSubmit;
    this.#_formElement = document.getElementById(`${this.#_formID}`);
    this.#didMount();
  }

  #validate () {
    let focus = null;
    for (const formControl of this.#_formControls) {
      if (formControl.handleError() && !focus) {
        focus = formControl.formControlEl;
        if (focus.matches('fieldset')) {
          focus = focus.querySelector(
            'input:invalid, textarea:invalid, select:invalid'
          );
        }
      }
    }
    if (focus) {
      focus.focus();
      return false;
    }
    return true;
  }

  #submit (event) {
    event.preventDefault();
    const submit = this.#validate();
    if (submit) {
      this.#_onSubmit(this.#_formElement);
    }
  }

  #addFormElements () {
    const fieldsetElements = Array.from(
      this.#_formElement.querySelectorAll('fieldset')
    );
    const independentInputElements = Array.from(
      this.#_formElement.querySelectorAll(
        ':not(fieldset) input, :not(fieldset) textarea, :not(fieldset) select'
      )
    );
    for (const fieldset of fieldsetElements) {
      this.#_formControls.push(new Fieldset(fieldset));
    }
    for (const el of independentInputElements) {
      let formControl;
      switch (el.tagName.toLowerCase()) {
        case Form.labeledTypes.select:
          formControl = new Select(el);
          break;
        case Form.labeledTypes.textarea:
          formControl = new Textarea(el);
          break;
        default:
          formControl = new Input(el);
          break;
      }
      this.#_formControls.push(formControl);
    }
  }

  #didMount () {
    this.#addFormElements();
    this.#_formElement.setAttribute('novalidate', 'true');
    this.#_formElement.addEventListener('submit', this.#submit.bind(this));
  }
}

class FormControl {
  #_formControlEl;
  #_error;
  #_customRestrictions = null;

  constructor (formControlEl) {
    this.#_formControlEl = formControlEl;
    this.didMount();
  }

  get error () {
    return this.#_error;
  }

  get formControlEl () {
    return this.#_formControlEl;
  }

  get customRestrictions () {
    return this.#_customRestrictions;
  }

  set customRestrictions (customRestrictions) {
    this.#_customRestrictions = customRestrictions;
  }

  didMount () {
    this.setCustomRestrictions();
    this.#_formControlEl.addEventListener('blur', this.handleError.bind(this));
  }

  addError (error) {
    this.#_error = error;
  }

  validate () {
    this.resetValidity();
    return this.defaultError();
  }

  defaultError () {
    const validity = this.#_formControlEl.validity;
    let errorMessage;
    switch (true) {
      case validity.valid:
        return true;
      case validity.valueMissing:
        errorMessage = 'Αυτό το πεδίο είναι υποχρεωτικό.';
        break;
      case validity.typeMismatch:
        if (this.#_formControlEl.type === 'email') {
          errorMessage =
            'Παρακαλώ εισάγετε μία ορθή διεύθυνση ηλεκτρονικού ταχυδρομείου.';
          break;
        }
        errorMessage = 'Παρακαλώ χρησιμοποιήστε τον σωστό τύπο πεδίου.';
        break;
      case validity.tooShort:
      case validity.tooLong:
        errorMessage = 'Η τιμή αυτού του πεδίου πρέπει να είναι ';
        const length = this.#_formControlEl.value.length;
        const minLength = parseInt(
          this.#_formControlEl.getAttribute('minlength')
        );
        const maxLength = parseInt(
          this.#_formControlEl.getAttribute('maxlength')
        );
        const plural = maxLength === 1 ? 'α' : 'ες';

        if (minLength) {
          errorMessage += `τουλάχιστον ${minLength} `;
        }

        if (maxLength) {
          if (errorMessage !== 'Πρέπει να επιλέξετε ') errorMessage += 'και ';
          errorMessage += `το πολύ ${maxLength} `;
        }

        if (maxLength === minLength) {
          errorMessage += `${maxLength} `;
        }

        errorMessage += ` χαρακτήρ${plural}. Έχετε εισάγει ${length} χαρακτήρ${
          length === 1 ? 'α' : 'ες'
        }.`;
        break;
      case validity.badInput:
        errorMessage = 'Παρακαλώ εισάγετε αριθμό.';
        break;
      case validity.stepMismatch:
        errorMessage = 'Παρακαλώ εισάγετε μία ορθή τιμή.';
        break;
      case validity.rangeOverflow:
      case validity.rangeUnderflow:
        errorMessage = 'Η τιμή για αυτό το πεδίο πρέπει να είναι ';
        const minValue = this.#_formControlEl.getAttribute('min');
        const maxValue = this.#_formControlEl.getAttribute('max');

        if (minValue) {
          errorMessage += `λιγότερο από ${maxValue} `;
        }
        if (maxValue) {
          if (minValue) errorMessage += 'και ';
          errorMessage += `περισσότερο από ${minValue} `;
        }

        errorMessage += `. Έχετε εισάγει ${this.#_formControlEl.value}.`;
        break;
      case validity.patternMismatch:
        if (this.#_formControlEl.hasAttribute('data-pattern-message')) {
          errorMessage = this.#_formControlEl.getAttribute(
            'data-pattern-message'
          );
          break;
        }
        errorMessage = 'Παρακαλώ ακολουθήστε το κατάλληλο μοτίβο.';
        break;
      case validity.customError:
        errorMessage = this.#_formControlEl.validationMessage;
        break;
      default:
        errorMessage = 'Η τιμή που εισάγατε δεν είναι ορθή.';
        break;
    }

    this.#_formControlEl.setCustomValidity(errorMessage);
    this.addError(new Error(this.#_formControlEl));

    return false;
  }

  handleError () {
    this.validate();
    if (this.#_error !== null && this.#_error !== undefined) {
      this.#_error.displayError();
      return true;
    }
    this.resetValidity();
    return false;
  }

  setCustomRestrictions () {
    const customRestrictions = new CustomRestrictions();

    const customAttributes = Array.from(
      this.#_formControlEl.getAttributeNames()
    )
      .filter(attribute => {
        return attribute.startsWith('data-');
      })
      .map(attribute => attribute.substring(5));

    for (const attribute of customAttributes) {
      customRestrictions[attribute] = this.#_formControlEl.getAttribute(
        `data-${attribute}`
      );
    }

    Object.keys(customRestrictions).forEach(attribute => {
      customRestrictions[attribute] == null &&
        delete customRestrictions[attribute];
    });

    let attributeCounter = 0;
    for (const key in customRestrictions) {
      ++attributeCounter;
    }

    if (attributeCounter !== 0) {
      this.#_customRestrictions = customRestrictions;
    }
  }

  resetValidity () {
    this.#_formControlEl.setCustomValidity('');
    this.#_error = null;
    Error.clearError(this.#_formControlEl);
  }
}

class Fieldset extends FormControl {
  #_fieldsetElements = [];

  constructor (fieldset) {
    super(fieldset);
    this.#registerElements();
    this.#updateCustomRestrictions();
    for (const el of this.#_fieldsetElements) {
      el.formControlEl.addEventListener('blur', this.handleError.bind(this));
    }
  }

  handleError () {
    let hasError = super.handleError();
    for (const el of this.#_fieldsetElements) {
      if (el.handleError()) hasError = true;
    }
    if (!hasError) {
      this.resetValidity();
    }
    return hasError;
  }

  validate () {
    let validity = super.validate();
    let activeElements = 0;
    let message = '';
    if (super.formControlEl.validity.customError) {
      message = super.formControlEl.validationMessage + '\n';
    }
    for (const formEl of this.#_fieldsetElements) {
      if (!formEl.validate()) {
        validity = false;
        super.addError(new Error(super.formControlEl));
      }
      const type = formEl.formControlEl.getAttribute('type');
      if (
        (type === 'radio' || type === 'checkbox') &&
        formEl.formControlEl.checked
      ) {
        ++activeElements;
      }
      if (formEl.formControlEl.value) {
        ++activeElements;
      }
    }
    if (super.customRestrictions) {
      if (super.customRestrictions.required && activeElements === 0) {
        message += 'Αυτό το πεδίο είναι υποχρεωτικό.\n';
        validity = false;
        super.addError(new Error(super.formControlEl, message));
      }

      message += 'Πρέπει να επιλέξετε ';
      let hasError = false;
      if (super.customRestrictions.min) {
        message += `το λιγότερο ${super.customRestrictions.min} `;
        if (super.customRestrictions.min > activeElements) hasError = true;
      }
      if (super.customRestrictions.max) {
        if (message !== 'Πρέπει να επιλέξετε ') message += 'και ';
        message += `το πολύ ${super.customRestrictions.max} `;
        if (super.customRestrictions.max < activeElements) hasError = true;
      }
      if (message !== 'Πρέπει να επιλέξετε ') {
        message += `στοιχεία. Έχετε επιλέξει ${activeElements} στοιχεία.`;
        if (hasError) {
          validity = false;
          super.addError(new Error(super.formControlEl, message));
        }
      }
    }
    return validity;
  }

  resetValidity () {
    super.resetValidity();
    for (const el of this.#_fieldsetElements) {
      el.resetValidity();
    }
  }

  #updateCustomRestrictions () {
    let customRestrictions = super.customRestrictions;

    for (const child of this.#_fieldsetElements) {
      child.setCustomRestrictions();
      if (child.formControlEl.getAttribute('required')) {
        if (customRestrictions === null || customRestrictions === undefined) {
          customRestrictions = new CustomRestrictions();
        }
        customRestrictions.required = 'required';
        super.customRestrictions = customRestrictions;
      }
    }
  }

  #registerElements () {
    const self = super.formControlEl;
    const labeledElements = Array.from(self.querySelectorAll('label'));

    for (const label of labeledElements) {
      let formControl;

      try {
        const id = label.getAttribute('for');
        formControl = document.getElementById(id);
      } catch (exception) {
        console.error(exception);

        let counter = 0;
        const labeledTypesArray = Object.keys(Form.labeledTypes);
        while (
          (formControl === null || formControl === undefined) &&
          counter < labeledTypesArray.length
        ) {
          formControl = label.querySelector(
            `${Form.labeledTypes[labeledTypesArray[counter++]]}`
          );
        }
      }

      if (formControl !== null && formControl !== undefined) {
        switch (formControl.tagName.toLowerCase()) {
          case Form.labeledTypes.select:
            this.#_fieldsetElements.push(new Select(formControl));
            break;
          case Form.labeledTypes.textarea:
            this.#_fieldsetElements.push(new Textarea(formControl));
            break;
          default:
            this.#_fieldsetElements.push(new Input(formControl));
            break;
        }
      }
    }
  }
}

class Input extends FormControl {
  constructor (input) {
    super(input);
  }

  didMount () {
    super.didMount();
    super.formControlEl.addEventListener('input', super.handleError.bind(this));
  }

  validate () {
    let isValid = super.validate();
    if (super.formControlEl.id === 'password-confirmation') {
      if (
        super.formControlEl.value !== document.getElementById('password').value
      ) {
        let message = '';
        if (super.formControlEl.validity.customError) {
          message += super.formControlEl.validationMessage + '\n';
        }
        message += 'Τα συνθηματικά πρέπει να είναι ίδια.';
        super.formControlEl.setCustomValidity(message);
        super.addError(new Error(super.formControlEl));
        isValid = false;
      }
    }
    return isValid;
  }
}

class Textarea extends FormControl {
  constructor (textarea) {
    super(textarea);
  }

  didMount () {
    super.didMount();
    super.formControlEl.addEventListener('input', super.handleError.bind(this));
  }
}

class Select extends FormControl {
  constructor (select) {
    super(select);
  }

  didMount () {
    super.didMount();
    super.formControlEl.addEventListener(
      'change',
      super.handleError.bind(this)
    );
  }
}

class Error {
  #_element;
  #_message;

  constructor (element, message = null) {
    this.#_element = element;
    this.#_message = message;
  }

  static clearError (el) {
    try {
      const validationPlaceholder = el.nextElementSibling;
      if (
        validationPlaceholder &&
        validationPlaceholder.classList.contains('validation-error')
      ) {
        validationPlaceholder.textContent = '';
        if (el.classList.contains('error')) {
          el.classList.remove('error');
        }
        if (el.parentNode.classList.contains('error')) {
          el.parentNode.classList.remove('error');
        }
      }

      if (el.matches('fieldset')) {
        if (el.classList.contains('error')) {
          el.classList.remove('error');
        }
        if (el.querySelector('legend').classList.contains('error')) {
          el.querySelector('legend').classList.remove('error');
        }
      }
    } catch (exception) {
      console.error(exception + '\nNo validation placeholder found.');
    }
  }

  displayError () {
    try {
      const validationPlaceholder = this.#_element.nextElementSibling;
      if (
        validationPlaceholder &&
        validationPlaceholder.classList.contains('validation-error')
      ) {
        validationPlaceholder.textContent =
          this.#_message || this.#_element.validationMessage;
        if (!this.#_element.classList.contains('error')) {
          this.#_element.classList.add('error');
        }
        if (!this.#_element.parentNode.classList.contains('error')) {
          this.#_element.parentNode.classList.add('error');
        }
      }

      if (this.#_element.matches('fieldset')) {
        if (!this.#_element.classList.contains('error')) {
          this.#_element.classList.add('error');
        }
        if (
          !this.#_element.querySelector('legend').classList.contains('error')
        ) {
          this.#_element.querySelector('legend').classList.add('error');
        }
      }
    } catch (exception) {
      console.error(exception + '\nNo validation placeholder found.');
    }
  }
}

export default Form;
