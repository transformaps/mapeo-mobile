// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Category } from '@types/category';
import type { Observation } from '@types/observation';
import { DARK_GREY, LIGHT_GREY, CHARCOAL, WHITE, MANGO } from '@lib/styles';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  category?: Category,
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void
};

type State = {
  text: string
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CHARCOAL
  },
  header: {
    flexDirection: 'row',
    backgroundColor: DARK_GREY,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  close: {
    position: 'absolute',
    left: 10
  },
  forward: {
    position: 'absolute',
    right: 10,
    backgroundColor: MANGO,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: LIGHT_GREY
  },
  categoryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: DARK_GREY
  },
  map: {
    height: 80,
    width: 80,
    backgroundColor: MANGO
  },
  categoryContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  categoryName: {
    fontSize: 15,
    color: WHITE,
    fontWeight: '600'
  },
  textInput: {
    fontSize: 20,
    padding: 20,
    paddingBottom: 30,
    color: WHITE,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  cameraText: {
    fontSize: 15,
    color: DARK_GREY,
    fontWeight: '600'
  },
  mediaList: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center'
  }
});

class ObservationEditor extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor() {
    super();

    this.state = { text: '' };
  }

  componentDidMount() {
    const { updateObservation, selectedObservation, category } = this.props;

    if (selectedObservation && category) {
      updateObservation({
        ...selectedObservation,
        type: category.name
      });
    }
  }

  handleTextInputChange = text => {
    this.setState({ text });
  };

  handleUpdateObservation = () => {
    const { updateObservation, selectedObservation } = this.props;
    const { text } = this.state;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: text
      });
    }
  };

  renderHeader = () => {
    const { navigation } = this.props;

    return (
      <View style={styles.header}>
        <TouchableHighlight
          style={styles.close}
          onPress={() => navigation.goBack()}
        >
          <Icon color="gray" name="close" size={25} />
        </TouchableHighlight>
        <Text style={styles.title}>Observaciones</Text>
        <TouchableHighlight
          style={styles.forward}
          onPress={this.handleUpdateObservation}
        >
          <Icon color="white" name="arrow-forward" size={25} />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const { navigation, selectedObservation } = this.props;
    const { text } = this.state;

    if (!selectedObservation) {
      navigation.goBack();
      return <View />;
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={{ flex: 1 }}>
          <View style={styles.categoryRow}>
            <View style={styles.map} />
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryName}>
                {selectedObservation.type}
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            placeholder="?Qué está pasando aquí"
            placeholderTextColor={DARK_GREY}
            underlineColorAndroid={DARK_GREY}
            multiline
            autoGrow
          />
          {selectedObservation &&
            !!selectedObservation.media.length && (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {selectedObservation.media.map(m => (
                  <Image source={m.source} style={{ width: 50, height: 50 }} />
                ))}
              </View>
            )}
          {selectedObservation &&
            !selectedObservation.media.length && (
              <TouchableHighlight
                style={styles.mediaList}
                onPress={() => navigation.navigate('CameraView')}
              >
                <Text style={styles.cameraText}>
                  No hay fotos. ?Toma algunos?
                </Text>
              </TouchableHighlight>
            )}
        </View>
      </View>
    );
  }
}

export default withNavigation(ObservationEditor);
