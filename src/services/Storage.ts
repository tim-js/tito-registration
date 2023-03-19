import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EVENT_SLUG,
  CHECKIN_LIST_SLUG,
  API_KEY,
  TEAM_SLUG,
} from '../constants';

export default class Storage {
  static setAccountSettings = async (accountSettings) => {
    const { checkinListSlug, apiKey, teamSlug, eventSlug } = accountSettings;
    if (checkinListSlug) {
      await Storage.setStorageInfo(CHECKIN_LIST_SLUG, checkinListSlug);
    }
    if (apiKey) {
      await Storage.setStorageInfo(API_KEY, apiKey);
    }
    if (apiKey) {
      await Storage.setStorageInfo(TEAM_SLUG, teamSlug);
    }
    if (eventSlug) {
      await Storage.setStorageInfo(EVENT_SLUG, eventSlug);
    }
  };

  static async getAccountSettings() {
    return {
      checkinListSlug: await Storage.getStorageInfo(CHECKIN_LIST_SLUG),
      apiKey: await Storage.getStorageInfo(API_KEY),
      teamSlug: await Storage.getStorageInfo(TEAM_SLUG),
      eventSlug: await Storage.getStorageInfo(EVENT_SLUG),
    };
  }

  static async clearAccountSettings() {
    await Storage.clearInfo(CHECKIN_LIST_SLUG);
    await Storage.clearInfo(API_KEY);
    await Storage.clearInfo(TEAM_SLUG);
    await Storage.clearInfo(EVENT_SLUG);
  }

  static async getStorageInfo(key) {
    try {
      return AsyncStorage.getItem(key, () => {});
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async setStorageInfo(key, info) {
    try {
      return AsyncStorage.setItem(key, info, () => {});
    } catch (error) {
      console.error(error);
    }
  }

  static async clearInfo(key) {
    try {
      return AsyncStorage.removeItem(key, () => {});
    } catch (error) {
      console.error(error);
    }
  }
}
