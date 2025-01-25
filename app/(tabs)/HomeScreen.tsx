import React, { useEffect, useState } from 'react';
import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import tmdbAPI, { Movie } from './tmdbAPI';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  MovieDetails: { movie: Movie };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await tmdbAPI.fetchPopularMovies();
        setMovies(moviesData);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true
          })
        ]).start();
      } catch (err) {
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length > 0) {
      setIsSearching(true);
      try {
        const searchResults = await tmdbAPI.searchMovies(query);
        setMovies(searchResults);
      } catch (err) {
        setError('Failed to search movies');
      } finally {
        setIsSearching(false);
      }
    } else {
      const moviesData = await tmdbAPI.fetchPopularMovies();
      setMovies(moviesData);
    }
  };

  const renderMovieItem = ({ item, index }: { item: Movie, index: number }) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        {
          scale: scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
          })
        },
        {
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }
      ]
    };

    return (
      <Animated.View
        style={[
          styles.movieItem,
          animatedStyle,
          { animationDelay: `${index * 100}ms` }
        ]}
      >
        <TouchableOpacity onPress={() => handleMoviePress(item)}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
            style={styles.moviePoster}
            blurRadius={0}
          />
          <BlurView
            style={styles.movieInfoOverlay}
            intensity={50}
            tint="dark"
          >
            <Text style={styles.movieTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.movieRating}>
              ★ {item.vote_average.toFixed(1)}
            </Text>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#121212"
        translucent={false}
      />
       <View>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>IDBFilm</Text>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search for movies..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      <AnimatedFlatList
        data={movies.filter((movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 25,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    color: '#FFF',
  },
  gridContainer: {
    paddingHorizontal: 8,
  },
  movieItem: {
    flex: 1,
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  moviePoster: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  movieInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  movieTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '70%',
  },
  movieRating: {
    color: 'gold',
    fontSize: 14,
    fontWeight: 'bold',
  },
  trailerContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  youtubePlayer: {
    width: '100%',
    height: 250,
  },
  noTrailerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  noTrailerText: {
    color: 'white',
    fontSize: 18,
  },
  modalBlurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalTouchableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 500,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalImageContainer: {
    width: '100%',
    height: height * 0.5,
    position: 'relative',
  },
  modalPoster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalDetailsContainer: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'left',
  },
  modalMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalRating: {
    color: 'gold',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  modalYear: {
    color: '#888',
    fontSize: 16,
  },
  modalOverview: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#ff5c5c',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});