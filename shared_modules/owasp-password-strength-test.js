let owaspConfig = {};

export function setOwaspConfig(config) {
    return owaspConfig = config;
}

export function getOwaspConfig() {
  return owaspConfig;
}

// This is an object containing the tests to run against all passwords.
const passwordTests = {
  // An array of required tests. A password *must* pass these tests in order
  // to be considered strong.
  required: [

    // enforce a minimum length
    (password) => {
      if (password.length < owaspConfig.minLength) {
        return 'The password must be at least ' + owaspConfig.minLength + ' characters long.';
      }
    },

    // enforce a maximum length
    (password) => {
      if (password.length > owaspConfig.maxLength) {
        return 'The password must be fewer than ' + owaspConfig.maxLength + ' characters.';
      }
    },

    // forbid repeating characters
    (password) => {
      if (/(.)\1{2,}/.test(password)) {
        return 'The password may not contain sequences of three or more repeated characters.';
      }
    },

  ],

  // An array of optional tests. These tests are "optional" in two senses:
  //
  // 1. Passphrases (passwords whose length exceeds
  //    owaspConfig.minPhraseLength) are not obligated to pass these tests
  //    provided that owaspConfig.allowPassphrases is set to Boolean true
  //    (which it is by default).
  //
  // 2. A password need only to pass owaspConfig.minOptionalTestsToPass
  //    number of these optional tests in order to be considered strong.
  optional: [

    // require at least one lowercase letter
    (password) => {
      if (!/[a-z]/.test(password)) {
        return 'The password must contain at least one lowercase letter.';
      }
    },

    // require at least one uppercase letter
    (password) => {
      if (!/[A-Z]/.test(password)) {
        return 'The password must contain at least one uppercase letter.';
      }
    },

    // require at least one number
    (password) => {
      if (!/[0-9]/.test(password)) {
        return 'The password must contain at least one number.';
      }
    },

    // require at least one special character
    (password) => {
      if (!/[^A-Za-z0-9]/.test(password)) {
        return 'The password must contain at least one special character.';
      }
    },

  ],
};

// This method tests password strength
export function passwordTest(password) {
  // create an object to store the test results
  const result = {
    errors: [],
    failedTests: [],
    passedTests: [],
    requiredTestErrors: [],
    optionalTestErrors: [],
    isPassphrase: false,
    strong: true,
    optionalTestsPassed: 0,
  };

  // Always submit the password/passphrase to the required tests
  let i = 0;
  passwordTests.required.forEach((test) => {
    const err = test(password);
    if (typeof err === 'string') {
      result.strong = false;
      result.errors.push(err);
      result.requiredTestErrors.push(err);
      result.failedTests.push(i);
    } else {
      result.passedTests.push(i);
    }
    i++;
  });

  // If configured to allow passphrases, and if the password is of a
  // sufficient length to consider it a passphrase, exempt it from the
  // optional tests.
  if (
    owaspConfig.allowPassphrases === true &&
    password.length >= owaspConfig.minPhraseLength
  ) {
    result.isPassphrase = true;
  }

  if (!result.isPassphrase) {
    let j = passwordTests.required.length;
    passwordTests.optional.forEach((test) => {
      const err = test(password);
      if (typeof err === 'string') {
        result.errors.push(err);
        result.optionalTestErrors.push(err);
        result.failedTests.push(j);
      } else {
        result.optionalTestsPassed++;
        result.passedTests.push(j);
      }
      j++;
    });
  }

  // If the password is not a passphrase, assert that it has passed a
  // sufficient number of the optional tests, per the configuration
  if (
    !result.isPassphrase &&
    result.optionalTestsPassed < owaspConfig.minOptionalTestsToPass
  ) {
    result.strong = false;
  }

  // return the result
  return result;
}