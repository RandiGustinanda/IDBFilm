import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
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

  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  // Animated styles
  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 500 }),
      transform: [{ translateY: withSpring(translateY.value) }]
    };
  });

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

    // Trigger entrance animations
    opacity.value = 1;
    translateY.value = 0;
  }, [movie, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.trailerContainer}>
          {trailerKey ? (
            <YoutubePlayer
              height={250}
              play={false}
              videoId={trailerKey}
              webViewStyle={styles.youtubePlayer}
            />
          ) : (
            <View style={styles.noTrailerContainer}>
              <Text style={styles.noTrailerText}>
                No trailer available
              </Text>
            </View>
          )}
        </View>

        <Animated.View 
          style={[styles.detailsContainer, animatedContentStyle]}
        >
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

              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="play" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Watch Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="bookmark" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Bookmark</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flex: 1,
  },
  trailerContainer: {
    width: '100%',
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  youtubePlayer: {
    width: '100%',
    height: 250,
  },
  noTrailerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  noTrailerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '300',
  },
  detailsContainer: {
    padding: 20,
    marginTop: -30,
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: '600',
  },
  backButton: {
    marginLeft: 10,
    padding: 10,
  },
});

export default MovieDetailsScreen;