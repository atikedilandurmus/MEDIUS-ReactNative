import React, { useState, useEffect, useRef } from 'react';

import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, Alert, Animated, ImageBackground, Modal} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Sabahimg from '../assets/Sabah.jpg';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 

import { firebase } from '../config';
import { useNavigation } from '@react-navigation/native';
import EnerjikSabahScreen from './Enerjik';


const sabah = Asset.fromModule(require('../assets/Sabah.jpg')).uri;
const nefes = Asset.fromModule(require('../assets/startmeditation.jpg')).uri;
const pozitif = Asset.fromModule(require('../assets/positive.jpg')).uri;
const disil = Asset.fromModule(require('../assets/disil.jpg')).uri;
const iliski = Asset.fromModule(require('../assets/iliski.jpg')).uri;
const uyku = Asset.fromModule(require('../assets/uyku.jpg')).uri;
const stres = Asset.fromModule(require('../assets/stres.jpg')).uri;
const ofke = Asset.fromModule(require('../assets/ofke.jpg')).uri;
const gecmis = Asset.fromModule(require('../assets/yalnizlik.jpg')).uri;
const kristal = Asset.fromModule(require('../assets/kristal.jpg')).uri;
const sualti = Asset.fromModule(require('../assets/derin.jpg')).uri;
const yagmur = Asset.fromModule(require('../assets/rain.jpg')).uri;
const dalga = Asset.fromModule(require('../assets/dalga.jpg')).uri;
const gif = require('../assets/giphy.gif');
const icon = Asset.fromModule(require('../assets/Medius.png')).uri;

const data = [
  {id : 1 , title: "Enerjik Sabah", image: sabah, category: 'Başlangıç', description: 'Enerjik Sabah', component: EnerjikSabahScreen},
  {id : 2 , title: "Olumlama", image: nefes, category: 'Başlangıç', description: 'Olumlama'},
  {id : 3 , title: "Olumluya Odaklan", image: pozitif, category: 'Başlangıç', description: 'Olumluya Odaklan' },
  {id : 4 , title: "Dişil Enerji", image: disil, category: 'Senin İçin...', description: 'Dişil Enerji'},
  {id : 6 , title: "Kendini Sevmek", image: iliski, category: 'Senin İçin...', description: 'Kendini Sevmek'},
  {id : 7 , title: "Uyku", image: uyku, category: 'Senin İçin...', description: 'Uyku'},
  {id : 8 , title: "Stres", image: stres, category: 'Daha Az...', description: 'Stres'},
  {id : 9 , title: "Öfke", image: ofke, category: 'Daha Az...', description: 'Öfke'},
  {id : 10 , title: "Geçmiş", image: gecmis, category: 'Daha Az...', description: 'Geçmiş'},
  {id : 11 , title: "Kristaller", image: kristal, category: 'Rahatlatıcı Sesler', description: 'Kristaller'},
  {id : 12 , title: "Su Altı", image: sualti, category: 'Rahatlatıcı Sesler', description: 'Su Altı'},
  {id : 13 , title: "Yağmur", image: yagmur, category: 'Rahatlatıcı Sesler', description: 'Yağmur'},
  {id : 13 , title: "Dalga", image: dalga, category: 'Rahatlatıcı Sesler', description: 'Dalga'},
  {id : 14 , title: "Bolum 1", image: dalga, category: 'Nefes...', description: 'Bölüm 1'},
  {id : 15 , title: "Bolum 2", image: dalga, category: 'Nefes...', description: 'Bölüm 2'},
  {id : 16 , title: "Bolum 3", image: dalga, category: 'Nefes...', description: 'Bölüm 3'},
  {id : 17 , title: "Bolum 4", image: dalga, category: 'Nefes...', description: 'Bölüm 4'},
  {id : 18 , title: "Bolum 5", image: dalga, category: 'Nefes...', description: 'Bölüm 5'},
  {id : 19 , title: "Bolum 6", image: dalga, category: 'Nefes...', description: 'Bölüm 6'},
  {id : 20 , title: "Bolum 7", image: dalga, category: 'Nefes...', description: 'Bölüm 7'},
  {id : 21 , title: "Bolum 8", image: dalga, category: 'Nefes...', description: 'Bölüm 8'},
  {id : 22 , title: "Bolum 9", image: dalga, category: 'Nefes...', description: 'Bölüm 9'},
  {id : 23 , title: "Bolum 10", image: dalga, category: 'Nefes...', description: 'Bölüm 10'},
];

const categories = [
  { id: 1, name: 'Başlangıç' },
  { id: 4, name: 'Rahatlatıcı Sesler' },
  { id: 2, name: 'Senin İçin...' }, 
  { id: 3, name: 'Nefes...' },
  { id: 3, name: 'Daha Az...' },  
];

const Header = ({ name }) => {
  return (
    <View style={styles.categoryContainer} >
      <Text style={styles.category}>{name}</Text>
    </View>
  )
};

const Card = ({ title, image, onPress, description, imageStyle, onLikePress, liked }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.card}>
      <Image source={{ uri: image }} style={[styles.image, imageStyle]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.aciklama}>{description}</Text>
       <TouchableOpacity style={styles.likeButton} onPress={onLikePress}>
      <Ionicons
        name={liked ? 'heart' : 'heart-outline'}
        size={20}
        color={liked ? 'red' : 'black'}
      />

      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);
  
const db = firebase.firestore();

const App = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const navigation = useNavigation();
const [likedCards, setLikedCards] = useState([]);
  const [slideData, setSlideData] = useState([]);
  const [affirmation, setAffirmation] = useState('');
  const [date, setDate] = useState('');
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    fetchRandomAffirmation();
    setDate(new Date().toLocaleDateString());
  }, []);

  const fetchRandomAffirmation = async () => {
    try {
      const snapshot = await db
        .collection('olumlamalar')
        .orderBy(firebase.firestore.FieldPath.documentId())
        .startAt(Math.random().toString())
        .limit(1)
        .get();

      const data = snapshot.docs.map((doc) => doc.data().notification);
      setAffirmation(data[0]);
    } catch (error) {
      console.log('Error fetching affirmation:', error);
    }
  };


  const handleCardPress = (component) => {
    setSelectedComponent(component);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Card
        title={item.title}
        image={item.image}
        onPress={() => handleCardPress(item)}
        description={item.description}
        imageStyle={item.category === 'Rahatlatıcı Sesler' ? styles.rahatlaticiSeslerImage : null}
        onLikePress={() => handleLikePress(item.id)}
        liked={likedCards.includes(item.id)}
      />
    </View>
  );

 const renderCategory = ({ item }) => {
  const filteredData = data.filter((itemData) => itemData.category === item.name);

  let categoryStyle = {};
  if (item.name === 'Rahatlatıcı Sesler') {
    categoryStyle = styles.rahatlaticiSesler; 
  }

  return (
    <View>
      <Header name={item.name} />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        horizontal={true}
        keyExtractor={(itemData) => itemData.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, categoryStyle]}
      />
    </View>
  );
};


const handleEmojiSelect = (selectedEmoji) => {
  const emoji = selectedEmoji;

  const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      return;
    }

    const moodsData = {
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      emoji: emoji,
      userId: currentUser.uid,
    };

    try {
      const db = firebase.firestore();

      db.collection('moods').add(moodsData)
        .then((docRef) => {
          console.log('Emoji added with ID: ', docRef.id);  
          Alert.alert('Medius',`Seçilen emoji: ${emoji}. Kaydedildi! Profilim'de Moods'larını görebilirsin.`);
          const addedEmoji = {
            id: docRef.id,
            ...moodsData
          };
          setMoods(prevMoods => [addedEmoji, ...prevMoods]);
        })
        .catch((error) => {
          console.error('Eklemede hata: ', error);
        });
    } catch (error) {
      console.error('Eklemede hata: ', error);
    }
};

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: showEmojis ? 1 : 0,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, showEmojis]);


  const Emojis = ['😀', '😍', '😭', '😡', '🥱', '🤔', '🤒'];

const handleLikePress = async (cardId) => {
  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }

    const cardDetails = data.find((item) => item.id === cardId);
    if (!cardDetails) {
      console.error('Card details not found.');
      return;
    }

    const favoritesRef = firebase.firestore().collection('favorites');
    await favoritesRef.doc(cardId.toString()).set({
      baslik: cardDetails.title,
      description: cardDetails.description,
      image: cardDetails.image,
      userId: user.uid,
    });

    console.log('Card added successfully!');
    Alert.alert('Medius', 'Meditasyonunuz başarıyla eklendi!');
  } catch (error) {
    console.error('Error adding card:', error);
  }
};



  return (
   
    <View style={styles.container}>
      <View style={styles.emoji}>      
        <ImageBackground source={gif} style={styles.backgroundImage}>
          {!selectedEmoji ? (
            <Image
              source={{ uri: icon }}
              style={{ width: 65, height: 65, borderRadius: 100, marginRight: 20, marginLeft: 40 }}
            />
          ) : (
            <TouchableOpacity
              style={{ width: 65, height: 65, borderRadius: 100, justifyContent: 'center', marginRight: 20, alignItems: 'center' }}
              onPress={() => setSelectedEmoji(null)}
            >
              <Text style={{ fontSize: 30 }}>{selectedEmoji}</Text>
            </TouchableOpacity>
          )}

          <View style={{ marginLeft: selectedEmoji ? 0 : 0 }}>
            <Text style={styles.title}>Merhaba <Ionicons name="ios-heart-sharp" size={22} color="pink" /> </Text>
            <TouchableOpacity onPress={() => setShowEmojis(!showEmojis)}>
              <Text style={styles.shareText}>Duygu durumunu hızlıca paylaş! <AntDesign name="caretdown" size={22} color="black" /></Text>
            </TouchableOpacity>
          {showEmojis && (
            <Animated.View style={{ flexDirection: 'row', marginTop: 0, opacity: fadeAnim }}>
              {Emojis.map((emoji) => (
                <TouchableOpacity key={emoji} onPress={() => handleEmojiSelect(emoji)}>
                  <Text style={{ fontSize: 30, marginTop: 15 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          </View>

          <View style={styles.content}>
              <Text style={styles.affirmationText}>{affirmation}</Text>
              <Text style={styles.dateText}>{date}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Olumlamalar')}>
                <Text style={styles.buttonText}>Daha fazlası için tıklayın</Text>
              </TouchableOpacity>
          </View>  
        </ImageBackground>
      </View>
 
      <View style={styles.page}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedComponent && selectedComponent.component && (
                <selectedComponent.component />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 300,
  },
  emoji: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  backgroundImage: {
    flexDirection: 'row',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    fontSize: 16,
    marginTop: 5,
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  content: {
    marginLeft: -390,
    marginTop: 90,
    width: '100%'
  },
  affirmationText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  page: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f4511e',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
 aciklama: {
      color: '#fff', 
    position: 'absolute', 
    textAlign:"center",
    fontSize:15,
    fontWeight: 'bold',
    fontStyle:'italic'
  },
   backgroundImage: {
    flexDirection: 'row',
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 20
  },
   categoryContainer:{
    marginLeft: 20,
  },
  shareText: { 
    fontSize: 16, 
    marginTop: 5, 
    marginRight: 10, 
    color: 'white', 
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  item: {
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFF',
    overflow: 'hidden',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
    
  },
   rahatlaticiSesler: {
  },
  rahatlaticiSeslerImage: {
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  containerAffirmation: {
  },
  affirmationText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'white',
    padding:50
  },
  dateText: {
    fontSize: 17,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'white',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'white',
  },
});

export default App;