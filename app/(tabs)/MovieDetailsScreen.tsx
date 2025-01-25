import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Linking
} from 'react-native';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import tmdbAPI, { Movie } from './tmdbAPI';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  MovieDetails: { movie: Movie };
};

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;
type MovieDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetails'>;

type Props = {
  route: MovieDetailsScreenRouteProp;
  navigation: MovieDetailsScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const MovieDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { movie } = route.params;
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const trailer = await tmdbAPI.fetchMovieTrailer(movie.id);
        setTrailerKey(trailer);
      } catch (error) {
        console.error('Failed to fetch trailer', error);
      }
    };

    fetchTrailer();

    // Set header title and trigger animations
    navigation.setOptions({
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )
    });
  }, [movie, navigation]);

  const handleWatchTrailer = () => {
    if (trailerKey) {
      setModalVisible(true);
    } else {
      alert('No trailer available');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        blurRadius={10}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailsContainer}>
            <View style={styles.glassContainer}>
              <View style={styles.contentWrapper}>
                <Text style={styles.title}>{movie.title}</Text>

                <View style={styles.metaContainer}>
                  <View style={styles.ratingBadge}>
                    <Icon name="star" size={16} color="gold" />
                    <Text style={styles.rating}>
                      {movie.vote_average.toFixed(1)}
                    </Text>
                  </View>
                  <Text style={styles.year}>
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                </View>

                <Text style={styles.overview}>
                  {movie.overview}
                </Text>

                {/* Tombol untuk menonton trailer */}
                <TouchableOpacity 
                  style={styles.watchTrailerButton} 
                  onPress={handleWatchTrailer}
                >
                  <Text style={styles.watchTrailerText}>
                    Watch Trailer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Modal untuk memutar trailer */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {trailerKey ? (
              <View style={styles.modalVideoContainer}>
                <TouchableOpacity 
                  style={styles.closeModalButton} 
                  onPress={handleCloseModal}
                >
                  <Icon name="close" size={30} color="white" />
                </TouchableOpacity>
                <WebView
                  source={{ uri: `https://www.youtube.com/embed/${trailerKey}?autoplay=1` }}
                  style={styles.webView}
                  allowsFullscreenVideo={true}
                />
              </View>
            ) : (
              <Text style={styles.noTrailerText}>
                No trailer available
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    opacity: 0.6,
  },
  scrollContainer: {
    flex: 1,
  },
  detailsContainer: {
    padding: 20,
    marginTop: 0,
  },
  glassContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  contentWrapper: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 15,
  },
  rating: {
    color: 'gold',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  year: {
    color: '#888',
    fontSize: 16,
    fontWeight: '300',
  },
  overview: {
    color: '#ddd',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
  watchTrailerButton: {
    backgroundColor: 'rgba(255,215,0,0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  watchTrailerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 15,
  },
  modalVideoContainer: {
    height: 250,
    width: '100%',
  },
  webView: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  closeModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  noTrailerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
  },
  backButton: {
    marginLeft: 10,
    padding: 10,
  },
});

export default MovieDetailsScreen;
