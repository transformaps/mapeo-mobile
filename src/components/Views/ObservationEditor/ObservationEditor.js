// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Image,
  FlatList
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import type { Category } from '../../../types/category';
import type { Observation } from '../../../types/observation';
import CategoryPin from '../../../images/category-pin.png';
import {
  LIGHT_GREY,
  WHITE,
  MANGO,
  MEDIUM_GREY,
  VERY_LIGHT_BLUE
} from '../../../lib/styles';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  category?: Category,
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  goToPhotoView: (photoSource: string) => void,
  addObservation: (o: Observation) => void,
  resetNavigation: () => void
};

type State = {
  keyboardShown: boolean,
  text: string
};

const styles = StyleSheet.create({
  addText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  },
  bottomButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: WHITE,
    height: 60,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  bottomButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  },
  categoryAtText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400'
  },
  categoryContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center'
  },
  categoryIcon: {
    height: 65,
    width: 65,
    backgroundColor: VERY_LIGHT_BLUE,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryName: {
    fontSize: 15,
    color: 'black',
    fontWeight: '600'
  },
  categoryPin: {
    width: 60,
    height: 60
  },
  categoryPinContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryPositionText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '700'
  },
  categoryRow: {
    flexDirection: 'row',
    height: 65,
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY
  },
  check: {
    position: 'absolute',
    right: 10,
    backgroundColor: MANGO,
    height: 35,
    width: 35,
    borderRadius: 50,
    justifyContent: 'center'
  },
  checkIcon: {
    alignSelf: 'center'
  },
  close: {
    position: 'absolute',
    left: 10
  },
  collectionsImg: {
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE
  },
  greyCheck: {
    position: 'absolute',
    right: 10,
    backgroundColor: LIGHT_GREY,
    height: 35,
    width: 35,
    borderRadius: 50,
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  mediaPlaceholder: {
    justifyContent: 'center',
    width: 65,
    height: 65,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginLeft: 10
  },
  mediaRow: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1,
    marginTop: -10
  },
  positionImg: {
    width: 35,
    height: 41,
    alignSelf: 'center'
  },
  textInput: {
    fontSize: 20,
    height: 130,
    padding: 20,
    paddingBottom: 30,
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    backgroundColor: 'whitesmoke'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  }
});

class ObservationEditor extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor(props: Props & StateProps & DispatchProps) {
    super();

    this.state = {
      text: props.selectedObservation ? props.selectedObservation.notes : ''
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentDidMount() {
    const { updateObservation, selectedObservation, category } = this.props;
    
    if (selectedObservation && category) {
      updateObservation({
        ...selectedObservation,
        type: category.name,
        name: category.name
      });
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState(previousState => {
      return { keyboardShown: true, text: previousState.text }
    });
  };

  keyboardDidHide = () => {
    this.setState(previousState => {
      return { keyboardShown: false, text: previousState.text }
    });
  };
  
  handleTextInputChange = text => {
    this.setState({ text });
  };

  handleSaveObservation = () => {
    const {
      addObservation,
      selectedObservation,
      resetNavigation
    } = this.props;
    const { text } = this.state;

    if (selectedObservation) {
      addObservation({
        ...selectedObservation,
        notes: text
      });
      resetNavigation();
    }
  };

  handleTextInputBlur = () => {
    const { selectedObservation, updateObservation } = this.props;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: this.state.text
      });
    }
  };

  goToCameraView = () => {
    Keyboard.dismiss();
    const { selectedObservation, updateObservation, navigation } = this.props;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: this.state.text
      });
    }
    const cameraAction = NavigationActions.navigate({
      routeName: 'CameraView'
    });
    navigation.dispatch(cameraAction);
  };

  renderHeader = () => {
    const { navigation, selectedObservation } = this.props;
    const { text } = this.state;
    const showGreyCheck =
      text === '' &&
      selectedObservation &&
      !selectedObservation.media.length;

    return (
      <View style={styles.header}>
        <TouchableHighlight
          style={styles.close}
          onPress={() => navigation.navigate('Categories')}
        >
          <Icon color="lightgray" name="close" size={25} />
        </TouchableHighlight>
        <Text style={styles.title}>Observaciones</Text>
        {showGreyCheck && (
          <View style={styles.greyCheck}>
            <FeatherIcon
              color="white"
              name="check"
              size={15}
              style={styles.checkIcon}
            />
          </View>
        )}
        {!showGreyCheck && (
          <TouchableHighlight
            style={styles.check}
            onPress={this.handleSaveObservation}
          >
            <FeatherIcon
              color="white"
              name="check"
              size={15}
              style={styles.checkIcon}
            />
          </TouchableHighlight>
        )}
        
      </View>
    );
  };

  render() {
    const { navigation, selectedObservation, goToPhotoView } = this.props;
    const { keyboardShown, text } = this.state;
    const positionText = selectedObservation
        ? `${selectedObservation.lat}, ${selectedObservation.lon}`
        : 'Loading...';
    const keyExtractor = item => item.source;

    if (!selectedObservation) {
      navigation.goBack();
      return <View />;
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        {this.renderHeader()}
        <View style={{ flex: 1 }}>
          <View style={styles.categoryRow}>
            <TouchableHighlight
              style={styles.categoryIcon}
              onPress={() => navigation.navigate('Categories')}
            >
              <View style={{ justifyContent: 'center' }}>
                <Image source={CategoryPin} style={styles.categoryPin} />
                <View 
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: 20
                  }}
                >
                  {selectedObservation && (selectedObservation.icon)}
                </View>
              </View>
            </TouchableHighlight>
            <View style={styles.categoryContainer}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text style={styles.categoryName}>
                  {selectedObservation.type}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.categoryAtText}>at </Text>
                  <Text style={styles.categoryPositionText}>{positionText}</Text>
                </View>
              </View>
              <TouchableHighlight
                onPress={() => navigation.navigate('Categories')}
                style={{ flex: 1, position: 'absolute', right: 5, alignSelf: 'center' }}
              >
                <FeatherIcon
                  color="lightgray"
                  name="chevron-right"
                  size={25}
                />
              </TouchableHighlight>
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            placeholder="¿Qué está pasando aquí..."
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            onBlur={this.handleTextInputBlur}
            multiline
            autoGrow
          />
          {selectedObservation &&
            !selectedObservation.media.length && (
              <View style={styles.mediaRow}>
                <View style={styles.mediaPlaceholder}>
                  <Icon
                    color={WHITE}
                    name="photo"
                    size={30}
                    style={styles.collectionsImg}
                  />
                </View>
              </View>
            )}
          {selectedObservation &&
            !!selectedObservation.media.length && (
              <View style={styles.mediaRow}>
                <FlatList
                  horizontal
                  style={{
                    flexDirection: 'column'
                  }}
                  contentContainerStyle={{
                    alignContent: 'flex-start'
                  }}
                  keyExtractor={keyExtractor}
                  renderItem={({ item }) => (
                    <TouchableHighlight
                      onPress={() => goToPhotoView(item.source)}
                      style={{ paddingLeft: 10 }}
                    >
                      <Image
                        source={{ uri: item.source }}
                        style={{
                          width: 65,
                          height: 65,
                          borderRadius: 5
                        }}
                      />
                    </TouchableHighlight>
                  )}
                  data={selectedObservation.media}
                />
              </View>
            )}
          <View style={styles.bottomButton}>
            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <Text style={styles.addText}>Add...</Text>
              {keyboardShown && (
                <TouchableHighlight
                  style={{ marginLeft: 70 }}
                  onPress={this.goToCameraView}
                >
                  <Icon
                    color={MEDIUM_GREY}
                    name="photo-camera"
                    size={30}
                  />
                </TouchableHighlight>
              )}
              {keyboardShown && (
                <TouchableHighlight
                  style={{ marginHorizontal: 60 }}
                >
                  <FontAwesomeIcon
                    color={MEDIUM_GREY}
                    name="microphone"
                    size={30}
                  />
                </TouchableHighlight>
              )}
              {keyboardShown && (
                <TouchableHighlight
                  style={{ marginRight: 30 }}
                >
                  <FontAwesomeIcon
                    color={MEDIUM_GREY}
                    name="pencil"
                    size={30}
                  />
                </TouchableHighlight>
              )}
            </View>
          </View>
          <TouchableHighlight
            style={styles.bottomButton}
            onPress={this.goToCameraView}
          >
            <View style={{ flexDirection: 'row' }}>
              <Icon
                color={MEDIUM_GREY}
                name="photo-camera"
                size={30}
                style={{ marginHorizontal: 30 }}
              />
              <Text style={styles.bottomButtonText}>Photos & Videos</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomButton}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                color={MEDIUM_GREY}
                name="microphone"
                size={30}
                style={{ marginHorizontal: 35 }}
              />
              <Text style={styles.bottomButtonText}>Audio</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomButton}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                color={MEDIUM_GREY}
                name="pencil"
                size={30}
                style={{ marginHorizontal: 32 }}
              />
              <Text style={styles.bottomButtonText}>Details</Text>
            </View>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default withNavigation(ObservationEditor);
