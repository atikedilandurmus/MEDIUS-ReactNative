import React, { useState } from 'react';

import {firebase} from '../config';

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Alert
} from 'react-native';


import Logo from '../components/Logo';

export default function Register({navigation}) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');

  const signupUser = async () => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    Alert.alert('Medius', 'Hesabınız oluşturuldu');
    navigation.navigate('Navigator'); 
  } catch (error) {
    console.log(error.message);
    Alert.alert('Medius', `Hata Oluştu: ${error.message}`);
  }
};


  return (
    <View style = {styles.container}>
      <Logo />
      <Text style= {styles.text}>Register</Text>
      <TextInput style = {styles.input} placeholder = "Email" value = {email} onChangeText = {setEmail} />
     
      <TextInput style = {styles.input} placeholder = "Password" value = {password} onChangeText = {setPassword} secureTextEntry/>

      <TextInput style = {styles.input} placeholder = "Re-Password" value = {repassword} onChangeText = {setRePassword} secureTextEntry/>
  
      <TouchableOpacity onPress = {signupUser} style = {styles.button}>
          <Text style = {styles.ekle_button}>Register</Text>
        </TouchableOpacity>
      <TouchableOpacity>
          <Text onPress = {() => navigation.navigate('Login')}>Do you have an account ? Login </Text>
        </TouchableOpacity>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f9fcfc',
      alignItems: 'center',
  },
  ekle_button: {
    color: 'white'
  },
  text: {
    fontWeight: "900",
    fontSize: '32',
    margin: 20,
    fontStyle: 'italic',
    color: '#65a3a3'
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#a3c2d6',
    borderRadius: 5 ,
    margin: 10,
    padding: 5,
  },
  button: {
    backgroundColor: '#65a3a3',
    width: 150,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 15
  },
});