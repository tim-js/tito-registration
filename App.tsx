import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import MainStackNavigation from './src/routers/MainStackNavigation';
import accountSettingsContext, {
  AccountSettings,
} from './src/contexts/accountSettingsContext';
import Storage from './src/services/Storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
