import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import { isSignedIn } from './src/auth';
import MainStackNavigation from './src/routers/MainStackNavigation';
import BottomTabsNavigation from './src/routers/BottomTabsNavigation';
import accountSettingsContext, {
  AccountSettings,
} from './src/contexts/accountSettingsContext';
import Storage from './src/services/Storage';

export default function App() {
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    apiKey: null,
    teamSlug: null,
    checkinListSlug: null,
    eventSlug: null,
  });
  const persistAccountSettings = async (settings: AccountSettings) => {
    await Storage.setAccountSettings(settings);
    setAccountSettings(settings);
  };
  const loadAccountSettings = async () => {
    const settings = await Storage.getAccountSettings();
    setAccountSettings(settings);
    return settings;
  };

  return (
    <accountSettingsContext.Provider
      value={{
        settings: accountSettings,
        setSettings: persistAccountSettings,
        getSettings: loadAccountSettings,
        clearSettings: async () => {
          await Storage.clearAccountSettings();
          setAccountSettings({
            apiKey: null,
            teamSlug: null,
            checkinListSlug: null,
            eventSlug: null,
          });
        },
      }}>
      <ThemeProvider>
        <NavigationContainer>
          <MainStackNavigation />
        </NavigationContainer>
      </ThemeProvider>
    </accountSettingsContext.Provider>
  );
}
