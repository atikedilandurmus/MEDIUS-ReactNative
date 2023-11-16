
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/tabsIcon';
import Home from './Home';
import Olumlamalar from './Olumlama';
import Settings from './Settings';

const Tab = createBottomTabNavigator();


const BottomTabNavigator = () => {
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Meditasyon') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Olumlamalar') {
            iconName = focused ? 'ios-flower' : 'ios-flower-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-person' : 'ios-person-outline';
          }


          return <TabBarIcon name={iconName} focused={focused} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#441a6b',
        inactiveTintColor: '#e2c8fa',
      }}
    >
      <Tab.Screen name="Meditasyon" 
                  component={Home} 
                  options={{
                  title: 'Meditasyon',
                  headerStyle: {
                    backgroundColor: '#f4511e',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontFamily: 'Snell Roundhand',
                    letterSpacing: 15,
                  },
                  headerShown: false
      }} />
      <Tab.Screen name="Olumlamalar" component = {Olumlamalar} options={{headerShown: false }}/>
      <Tab.Screen name="Settings"  component = {Settings} options={{headerShown: false }}/>
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;