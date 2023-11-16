import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
import { firebase } from './config';

const AuthContext = React.createContext();

import Login from './Screens/Login';
import SignUp from './Screens/Register';
import Home from './Screens/Home';
import Navigator from './Screens/Navigator';
import Olumlamalar from './Screens/Olumlama';
import Profile from './Screens/Settings/Profile';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authContextValue = useMemo(
    () => ({
      signIn: async (email, password) => {
        try {
          await firebase.auth.signInWithEmailAndPassword(email, password);
        } catch {
          console.log(error.message);
        }
      },

      signOut: async () => {
        try {
          await firebase.auth.signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (error) {
          console.log(error.message);
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="/Login">
          {user ? (
            <>
              <Stack.Screen
                name="Navigator"
                children={(props) => <Navigator {...props} user={user} />}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="Signup"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen name = "Olumlamalar" component= {Olumlamalar} options={{ headerShown: false }}/>
          <Stack.Screen name = "Profile" component= {Profile} options={{ headerShown: false }}/>

          <Stack.Screen name = "EnerjikSabahScreen"/>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
