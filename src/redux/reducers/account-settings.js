import {SET_ACCOUNT_SETTINGS, CLEAR_ACCOUNT_SETTINGS, SET_EVENT_SLUG} from '../action-types';
const initialState = { accountSettings: {} };

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ACCOUNT_SETTINGS: {
      return {
        ...state,
        accountSettings: action.accountSettings
      }
    }
    case CLEAR_ACCOUNT_SETTINGS: {
      return {
        ...state,
        accountSettings: {}
      }
    }
    case SET_EVENT_SLUG: {
      return {
        ...state,
        eventSlug: action.eventSlug
      }
    }
    default:
      return state;
  }
}
