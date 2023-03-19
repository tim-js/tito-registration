import { useContext } from 'react';
import accountSettingsContext from '../contexts/accountSettingsContext';

const useAccountSettings = () => useContext(accountSettingsContext);

export default useAccountSettings;
