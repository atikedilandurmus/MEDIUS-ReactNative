import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ImageBackground, TouchableOpacity, Switch, Modal, ScrollView, Linking, Alert } from 'react-native';
import { firebase } from '../config';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

const SettingsScreen = () => {
  const [user, setUser] = useState(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalFavVisible, setModalFavVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const toggleNotification = () => {
    setNotificationEnabled((prevValue) => !prevValue);
  };
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userId = firebase.auth().currentUser.uid;
        const snapshot = await firebase.firestore().collection('notes').where('userId', '==', userId).get();
        const fetchedNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          note: doc.data().note,
          date: doc.data().date,
        }));
        setNotes(fetchedNotes);
      } catch (error) {
        console.log('Moodları cekmede hata:', error);
      }
    };

    fetchNotes();
  }, []);

  const handleAddNote = () => {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      return;
    }

    const noteData = {
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      note: newNote,
      userId: currentUser.uid,
    };

    try {
      const db = firebase.firestore();

      db.collection('notes').add(noteData)
        .then((docRef) => {
          console.log('Not kaydedildi. IDsi: ', docRef.id);
          const addedNote = {
            id: docRef.id,
            ...noteData
          };
          setNotes(prevNotes => [addedNote, ...prevNotes]);
        })
        .catch((error) => {
          console.error('Notu kaydetmede hata ', error);
        });
    } catch (error) {
      console.error('Notu kaydetmede hata ', error);
    }
  };


  const handleInstagramLink = () => {
    Linking.openURL('https://www.instagram.com/atiikeus');
  };


const handleLogoutPress = () => {
  Alert.alert(
    'Çıkış Yap',
    'Çıkış yapmak istediğinize emin misiniz?',
    [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Evet',
        onPress: () => {
          const currentUser = firebase.auth().currentUser;
          if (currentUser) {
            firebase.auth().signOut()
              .then(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              })
              .catch(error => {
                console.log('Çıkış yaparken bir hata oluştu:', error);
              });
          } else {
            console.log("Oturum açmamış bir kullanıcı çıkış yapmaya çalışıyor.");
          }
        },
      },
    ],
    { cancelable: false }
  );
};






  const openModal = () => {
      setModalVisible(true);
    };

    const closeModal = () => {
      setModalVisible(false);
    };
    const openModalFav = () => {
      setModalFavVisible(true);
    };

    const closeModalFav = () => {
      setModalFavVisible(false);
    };

const handleDeleteNote = (noteId) => {
  try {
    const db = firebase.firestore();

    db.collection('notes').doc(noteId).delete()
      .then(() => {
        console.log('Not başarıyla silindi');
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      })
      .catch((error) => {
        console.error('Notu silmede hata: ', error);
      });
  } catch (error) {
    console.error('Notu silmede hata: ', error);
  }
};

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


  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const favoritesRef = firebase.firestore().collection('favorites');
      favoritesRef
        .where('userId', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          const favoriteItems = [];
          querySnapshot.forEach((doc) => {
            const favoriteData = doc.data();
            favoriteItems.push(favoriteData);
          });
          setFavorites(favoriteItems);
        })
        .catch((error) => {
          console.error('Favorileri çekmede hata:', error);
        });
    }
  }, []);

const renderNotesByDate = () => {
  const groupedNotes = {};

  notes.forEach((note) => {
    const formattedDate = note.date.toDate().toLocaleDateString('tr-TR');

    if (!groupedNotes[formattedDate]) {
      groupedNotes[formattedDate] = [];
    }
    groupedNotes[formattedDate].push(note);
  });

  return Object.keys(groupedNotes).map((formattedDate) => (
    <>
    <View key={formattedDate}>
      <Text style={styles.groupTitle}>{formattedDate}</Text>
      {groupedNotes[formattedDate].map((note) => (
       <View key={note.id} style={styles.messageContainer}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageEmoji}>{note.note}</Text>
             <TouchableOpacity
                 style={styles.deleteButton}
                 onPress={() => handleDeleteNote(note.id)}    >
                <View style={styles.deleteIconContainer}>
                  <Ionicons name="trash" color='red' size={20} style={styles.deleteIcon} />
                </View>
              </TouchableOpacity>
          </View>
          <View >
            <Text style={styles.messageTimeFade}>{note.date.toDate().toLocaleTimeString('tr-TR')}</Text>
          </View>
        </View>
      ))}
    </View>
    <View>
      <TouchableOpacity style={styles.buttonEkle} onPress={() => setShowNoteInput(true)}>
        <Text style={styles.addButtonText}>Yeni Not Ekle</Text>
      </TouchableOpacity>
    </View>
    </>
  ));
};


  return (
    <View style={styles.container}>
      <View style={styles.settingUserContainer}>
        <ImageBackground
          source={require('../assets/ayarlarback.jpg')} 
          style={styles.backgroundImage}
        >
          <View style={styles.settingUser}>
            <Image source={require('../assets/profileicon.png')} style={[styles.userPhoto, { tintColor: '#89a9e0' }]} />
            {user && (
              <View>
                <Text style={styles.emailInput}>{user.email}</Text>
              </View>
            )}
          </View>
        </ImageBackground>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome5 name="user-alt"  style={{color:"#89a9e0",fontSize:20, borderRadius:20,padding:11,marginRight:15}} />
          <Text style={styles.text}>Profilim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} >
          <Ionicons name="md-notifications-sharp" style={{color:"#89a9e0",fontSize:20, borderRadius:20,padding:11,marginRight:15}} />
          <Text style={styles.text}>Bildirimler</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={toggleNotification}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationEnabled ? '#ffe0c2' : '#f4f3f4'}
            style={styles.switch}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openModalFav}>
          <FontAwesome5 name="star"  style={{color:"#89a9e0",fontSize:20, borderRadius:20,padding:11,marginRight:15}} />
          <Text style={styles.text}>Favorilerim</Text>
        </TouchableOpacity>
         <Modal visible={modalFavVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalTitle}>Favorilerim</Text>
                {favorites.length === 0 ? (
                  <Text style={styles.noFavoritesText}>Şu anda favori bulunmamaktadır.</Text>
                ) : (
                  favorites.map((favorite) => (
                    <View key={favorite.id} style={styles.favoriteItem}>
                      <Text style={styles.favoriteDescription}>{favorite.description}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={closeModalFav}>
                <Ionicons name="ios-close" style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
        </Modal>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <FontAwesome5 name="pencil-alt"  style={{color:"#89a9e0",fontSize:20, borderRadius:20,padding:11,marginRight:15}} />
          <Text style={styles.text}>Notlarım</Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                      <ScrollView style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Notlarım</Text>
                         <ScrollView style={styles.notesContainer}>
                          {notes.length === 0 ? (
                            <>
                              <Text style={styles.noNotes}>Şu an kayıtlı olan notun yok 😔</Text>
                              <TouchableOpacity style={styles.buttonEkle} onPress={() => setShowNoteInput(true)}>
                                <Text style={styles.addButtonText}>Yeni Not Ekle</Text>
                              </TouchableOpacity>
                            </>
                            ) : (
                              renderNotesByDate()
                            )}

                          </ScrollView>
                           {showNoteInput && (
                             <>
                             <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <TextInput
                              style={styles.addNoteInput}
                              placeholder="Notunuzu buraya yazın"
                              value={newNote}
                              onChangeText={setNewNote}
                              onSubmitEditing={handleAddNote}
                            />
                             <TouchableOpacity style={styles.addNoteButton} onPress={handleAddNote}>
                                <Text style={styles.addNoteButtonText}>Yeni Not Ekle</Text>
                              </TouchableOpacity>
                              </View>
                              </>
                          )}
                      </ScrollView>

                      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                        <Ionicons name="ios-close" style={styles.closeIcon} />
                      </TouchableOpacity>
                    </View>
                  </Modal>
        <TouchableOpacity style={styles.buttontakip} onPress={handleInstagramLink}>
          <Text style={{color:"#89a9e0",fontSize:20, borderRadius:20,marginRight:15, padding: 11}} > 🫶🏻 </Text>
          <Text style={styles.text}>Bizi Takip Edin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogoutPress}>
          <Ionicons name="exit"  style={{color:"#89a9e0",fontSize:20, borderRadius:20,padding:11,marginRight:15}} />
          <Text style={styles.text}>Çıkış</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  switch: {
    marginLeft: 'auto',
  },
  backgroundImage: {
    marginBottom: 20
  },
  settingUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 60,
    paddingLeft: 20,
    paddingBottom: 30
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  email: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  emailInput: {
    fontSize: 16,
    marginTop: 5,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
  },
  addNoteInput: {
    fontSize: 16,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    height: 40,
  },
  addNoteButton: {
    backgroundColor: '#8191fc',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
        textAlign: 'center',

  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e4e3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    margin: 14
  },
  buttonEkle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    margin: 14,
    backgroundColor: '#8191fc'
  },
  addButtonText: {
    textAlign: 'center',
  },
  noNotes: {
    textAlign: 'center',
  },
  buttontakip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e4e3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 55,
    margin: 15
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
    maxHeight: '70%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
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
   messageBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    marginBottom: 10,
  },
  messageEmoji: {
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  deleteIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  deleteIcon: {
    textAlign: 'center',
  },
   messageTimeFade: {
    color: 'rgba(0, 0, 0, 0.5)', // Faded color (adjust the opacity as needed)
    fontSize: 12, // Adjust the font size as needed
    marginBottom: 15,
  },
   groupTitle: {
    fontSize: 18, // Adjust the font size as needed
    fontWeight: 'bold', // Adjust the font weight as needed
    marginBottom: 10, // Adjust the margin bottom as needed
    color: '#333', // Adjust the color as needed
  },
});

export default SettingsScreen;
