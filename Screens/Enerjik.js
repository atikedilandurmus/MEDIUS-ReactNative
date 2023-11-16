import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const EnerjikSabahScreen = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const playbackTimer = useRef(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


  useEffect(() => {
  if (sound) {
    const updatePlaybackProgress = async () => {
      const status = await sound.getStatusAsync();
      const { positionMillis, durationMillis } = status;
      setPlaybackPosition(positionMillis);
      setPlaybackDuration(durationMillis);
    };

    playbackTimer.current = setInterval(updatePlaybackProgress, 1000);

    return () => {
      clearInterval(playbackTimer.current);
      playbackTimer.current = null;
    };
  }
}, [sound]);


  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../Sounds/enerjiksabahcut.mp3')
      );
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    }
  };

  const formatTime = (timeInMilliseconds) => {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

   const handleStepBackward = async () => {
  if (sound) {
    const currentPosition = playbackPosition - 10000; 
    const newPosition = currentPosition < 0 ? 0 : currentPosition;
    await sound.setPositionAsync(newPosition);
    setPlaybackPosition(newPosition);
  }
};

const handleStepForward = async () => {
  if (sound && playbackPosition < playbackDuration) {
    const currentPosition = playbackPosition + 10000;
    const newPosition = currentPosition > playbackDuration ? playbackDuration : currentPosition;
    await sound.setPositionAsync(newPosition);
    setPlaybackPosition(newPosition);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textcont}>
          <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold', fontStyle: 'italic', marginVertical: 24 }}>
            Başlarken
          </Text>
        </View>
        <View style={styles.secondImageContainer}>
          <Image source={require('../assets/Sabah.jpg')} style={styles.secondImage} />
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressBarFill, { width: `${(playbackPosition / playbackDuration) * 100}%` }]} />
          </View>
            {playbackPosition > 0 && (
            <View style={styles.progressBarTextContainer}>
              <Text style={styles.progressBarText}>{formatTime(playbackPosition)}</Text>
            </View>
          )}
        </View>


        <View style={styles.playbackBar}>
          <TouchableOpacity style={styles.controlButton} onPress={handleStepBackward}>
            <AntDesign name="stepbackward" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handlePlayPause}>
            {isPlaying ? (
              <AntDesign name="pause" size={48} color="white" /> 
            ) : (
              <AntDesign name="play" size={48} color="white" /> 
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleStepForward}>
            <AntDesign name="stepforward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.textcont}>
          <Text style={styles.title}>Enerjik Sabah</Text>
          <Text style={styles.description}>Enerjik bir güne merhaba deyin!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textcont: {
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  playbackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    marginHorizontal: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: 'white',
    marginVertical: 24,
  },
  progressBarContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f4511e',
    borderRadius: 2,
  },
  progressBarTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    width: 240
  },
  progressBarText: {
    color: 'white',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#f4511e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  secondImageContainer: {
    marginTop: 20,
  },
  secondImage: {
    width: 250,
    height: 250,
    marginBottom: 20
  },
});

export default EnerjikSabahScreen;