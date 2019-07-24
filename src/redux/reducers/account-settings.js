import {GET_ACCOUNT_SETTINGS, SET_ACCOUNT_SETTINGS, CLEAR_ACCOUNT_SETTINGS} from '../action-types';
const initialState = { accountSettings: {} };

export default function(state = {}, action) {
  switch (action.type) {
    case SET_ACCOUNT_SETTINGS: {
      return {
        ...state,
        apiKey: action.accountSettings.apiKey,
        teamSlug: action.accountSettings.teamSlug,
        checkinListSlug: action.accountSettings.checkinListSlug,
      }
    }
    case CLEAR_ACCOUNT_SETTINGS: {
      return {
        ...state,
        apiKey: null,
        teamSlug: null,
        checkinListSlug: null,
      }
    }
    case GET_ACCOUNT_SETTINGS: {
      return {
        ...state,
        checkinListSlug: action.accountSettings.checkinListSlug,
      }
    }
    default:
      return state;
  }
}
