import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { firebase } from '../config';
import Swiper from 'react-native-swiper';

const db = firebase.firestore();

const Olumlamalar = () => {
  const [slideData, setSlideData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await db.collection('olumlamalar').get();
        const data = snapshot.docs.map((doc) => doc.data().notification);
        setSlideData(data);
      } catch (error) {
        console.log('Olumlamaları çekerken:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
     <ImageBackground
        source={require('../assets/olumlamaback.jpg')}
        style={styles.image}
      >
        <Swiper>
        {slideData.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.slideText}>{slide}</Text>
          </View>
        ))}
      </Swiper>
      </ImageBackground>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover', 
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  slideText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic'
  },
});

export default Olumlamalar;
