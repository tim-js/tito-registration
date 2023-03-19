import { createContext } from 'react';

export interface AccountSettings {
  apiKey: string;
  teamSlug: string;
  checkinListSlug: string;
  eventSlug: string;
}

export interface AccountContext {
  settings: AccountSettings;
  setSettings: (settings: AccountSettings) => Promise<void>;
  getSettings(): Promise<AccountSettings>;
  clearSettings(): Promise<void>;
}

const accountSettingsContext = createContext<AccountContext>({
  settings: {
    apiKey: null,
    teamSlug: null,
    checkinListSlug: null,
    eventSlug: null,
  },
  setSettings: (settings: AccountSettings) => Promise.resolve(),
  getSettings: () =>
    Promise.resolve({
      apiKey: null,
      teamSlug: null,
      checkinListSlug: null,
      eventSlug: null,
    }),
  clearSettings: () => Promise.resolve(),
});

export default accountSettingsContext;
