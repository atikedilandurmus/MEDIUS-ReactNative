import React, {useState} from 'react';
import {
  View,
  Text, 
  TextInput, 
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';


import { firebase } from '../config';

import Logo from '../components/Logo';

export default function Login ({navigation}){

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
      try{
        await firebase.auth().signInWithEmailAndPassword(email, password);
        Alert.alert('Medius', 'Giriş yapıldı');
      }catch(error){
        console.log(error.message);
        Alert.alert('Medius', `Hata Oluştu: ${error.message}`);
      }
  };
  
  return (
     <View style = {styles.container}>
      <Logo style = {styles.loginLogo}/>
      <Text style= {styles.text}>Login</Text>
      <TextInput style = {styles.input} placeholder = "Email" value = {email} onChangeText = {setEmail} keyboardType = "email-address" />
     
      <TextInput style = {styles.input} placeholder = "Password" value = {password} onChangeText = {setPassword} secureTextEntry />
  
      <TouchableOpacity onPress = {signIn} style = {styles.button}>
          <Text style = {styles.ekle_button}>Login</Text>
        </TouchableOpacity>
      <TouchableOpacity >
          <Text onPress = {() => navigation.navigate('Signup')}>Don't have an account ? Register</Text>
        </TouchableOpacity>
     
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f9fcfc',
      alignItems: 'center',
      fontFamily: 'Poppins_300Light_Italic',
  },
  loginLogo: {
    borderWidth: 1,
    borderColor: '#65a3a3',
    borderRadius: 100
  },
  ekle_button: {
    color: 'white'
  },
  text: {
    fontWeight: "900",
    fontSize: '32',
    marginBottom: 20,
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