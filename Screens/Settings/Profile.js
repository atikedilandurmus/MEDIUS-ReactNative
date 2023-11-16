import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { firebase } from '../../config';
import { Ionicons } from '@expo/vector-icons'; 

import ImagePicker from 'react-native-image-picker';


const Profile = () => {
const [userPhoto, setUserPhoto] = useState(null);
const [modalVisible, setModalVisible] = useState(false);

const [moods, setMoods] = useState([]);

 const [user, setUser] = useState({
    name: '',
    email: '',
    birthDate: '',
  });

  const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [birthDate, setBirthDate] = useState('');

const handleSave = async () => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    return;
  }

  try {
    const db = firebase.firestore();

    await db.collection('profile').doc(currentUser.uid).set({
      name,
      email,
      birthDate,
    });

    console.log('Kullanıcı bilgileri başarıyla gönderildi.');
    Alert.alert('Medius', 'Profil Bilgileriniz Başarıyla Gönderildi!');

    navigation.navigate('Profile');
  } catch (error) {
    console.error('Kullanıcı bilgileri gönderilirken bir hata oluştu:', error);
  }
};
useEffect(() => {
  const fetchMoods = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const snapshot = await firebase.firestore().collection('moods').where('userId', '==', userId).get();
      const fetchedMoods = snapshot.docs.map((doc) => ({
        id: doc.id,
        emoji: doc.data().emoji,
        date: doc.data().date,
      }));
      setMoods(fetchedMoods);
    } catch (error) {
      console.log('Error fetching moods:', error);
    }
  };

  fetchMoods();
}, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSelectPhoto = () => {
  ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
    if (!response.didCancel && !response.error) {
      setUserPhoto(response.uri);
    }
  });
};

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        // Oturum açmış bir kullanıcı varsa, kullanıcıyı güncelleyin
        setUser(authUser);
      } else {
        // Oturum açmış bir kullanıcı yoksa, kullanıcıyı null olarak ayarlayın
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toDate().toLocaleString("en-US", options);
  };

 

  return (
    <View style={styles.container}>
      <View style={styles.settingUserContainer}>
          <View style={styles.settingUser}>
            <TouchableOpacity onPress={handleSelectPhoto}>
              <Image
                source={userPhoto ? { uri: userPhoto } : require('../../assets/profileicon.png')}
                style={[styles.userPhoto, { tintColor: 'black' }]}
              />
            </TouchableOpacity>
            <Text style={styles.text}>Profil Fotografı</Text>
          </View>
          <View style={styles.page}>
             {user && (
              <View>
                <View>
                <View>
                  <Text style={styles.email}>Adınız</Text>
                  <TextInput
                    style={styles.emailInput}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <View>
                  <Text style={styles.email}>E-posta</Text>
                  <TextInput
                    style={styles.emailInput}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View>
                  <Text style={styles.email}>Doğum Tarihi</Text>
                  <TextInput
                    style={styles.emailInput}
                    placeholder="GG/AA/YYYY"
                    value={birthDate}
                    onChangeText={setBirthDate}
                  />
                </View>

                </View>
                <View style={{alignItems: 'center'}}>
                   <TouchableOpacity style={styles.buttonKaydet} onPress={handleSave}>
                      <Text style={styles.textKaydet}>Kaydet</Text>
                    </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity style={styles.button} onPress={openModal}>
                    <Ionicons name="ios-star" style={styles.icon} />
                    <Text style={styles.textbaslik}>Moods</Text>
                  </TouchableOpacity>

                  <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                      <ScrollView style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Moodslarım</Text>
                        {moods.map((mood) => (
                          <View key={mood.id} style={styles.messageContainer}>
                            <View style={styles.messageBubble}>
                              <Text style={styles.messageDate}>{formatDate(mood.date)}</Text>
                              <Text style={styles.messageEmoji}>{mood.emoji}</Text>
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Ionicons name="ios-close" style={styles.closeIcon} />
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              </View>
            )}
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,    
    backgroundColor: '#FFFFFF',

  },
   icon: {
    color: '#8191fc',
    fontSize: 20,
    padding: 7,
    marginRight: 15,
  },
  settingUser: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,   
    marginTop: 25, 
    paddingBottom:14,  
    backgroundColor: '#F5F5F5',

  },
  messageContainer: {
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  messageBubble: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageDate: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  messageEmoji: {
    fontSize: 18,
  },
  page: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20
  },
  text: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 25,
    marginBottom:10
  },
  email: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15
  },
   button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e4e3',
    padding: 10,
    borderRadius: 20,
    marginTop: 30,
  },
buttonKaydet: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#8191fc',
  padding: 10,
  borderRadius: 20,
  marginTop: 30,
  width: 100,
  justifyContent: 'center', // Yatayda ortalamak için
},
textKaydet: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: 'bold',
  textAlign: 'center', // Metni ortalamak için
},

  textbaslik: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 130
  },
  emailInput: {
    fontSize: 16,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    height: 40
  },
   modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    maxHeight: '50%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: 'transparent',
    padding: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: 'black',
  },
});

export default Profile;