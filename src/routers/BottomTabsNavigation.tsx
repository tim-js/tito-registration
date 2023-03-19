import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../containers/Dashboard';
import { Ionicons } from '@expo/vector-icons';
import Events from '../containers/Events';
import CheckinList from '../containers/CheckinList';
import Scan from '../containers/Scan';

const Tab = createBottomTabNavigator();

function BottomTabsNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="md-home"
              size={20}
              color={color}
              style={{ marginTop: 6 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="md-list"
              size={20}
              color={color}
              style={{ marginTop: 6 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CheckinList"
        component={CheckinList}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="md-list-circle"
              size={20}
              color={color}
              style={{ marginTop: 6 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="md-qr-code"
              size={20}
              color={color}
              style={{ marginTop: 6 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabsNavigation;
