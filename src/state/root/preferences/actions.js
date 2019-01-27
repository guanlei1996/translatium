import { SET_PREFERENCE, UPDATE_OUTPUT } from '../../../constants/actions';

import { isOutput } from '../../../helpers/language-utils';

import { translate } from '../../pages/home/actions';

export const setPreference = (name, value) => ({
  type: SET_PREFERENCE,
  name,
  value,
});

export const togglePreference = name => ((dispatch, getState) => {
  const value = !getState().preferences[name];
  dispatch(setPreference(name, value));
});


const runAfterLanguageChange = language => ((dispatch, getState) => {
  const { preferences } = getState();
  const { realtime, recentLanguages } = preferences;

  if (realtime === true) {
    dispatch(translate());
  } else {
    dispatch({
      type: UPDATE_OUTPUT,
      output: null,
    });
  }

  if (!language) return;

  if (recentLanguages.indexOf(language) < 0 && language !== 'auto') {
    recentLanguages.unshift(language);
  }

  dispatch(setPreference('recentLanguages', recentLanguages.slice(0, 6)));
});

export const swapLanguages = () => ((dispatch, getState) => {
  const { inputLang, outputLang } = getState().preferences;

  if (isOutput(inputLang) === false) return;

  dispatch(setPreference('inputLang', outputLang));
  dispatch(setPreference('outputLang', inputLang));

  dispatch(runAfterLanguageChange());
});

export const updateInputLang = value => ((dispatch, getState) => {
  if (getState().preferences.outputLang === value) { // newInputLang === outputLang
    dispatch(swapLanguages());
    return;
  }

  dispatch(setPreference('inputLang', value));
  dispatch(runAfterLanguageChange(value));
});

export const updateOutputLang = value => ((dispatch, getState) => {
  if (getState().preferences.inputLang === value) { // newOutputLang === inputLang
    dispatch(swapLanguages());
    return;
  }

  dispatch(setPreference('outputLang', value));
  dispatch(runAfterLanguageChange(value));
});
