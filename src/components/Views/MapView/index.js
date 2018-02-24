// @flow
import { connect } from 'react-redux';
import { observationList, observationCreate } from '@ducks/observations';
import type { Dispatch } from 'redux';
import { StoreState } from '@types/redux';
import MapView from './MapView';
import type { DispatchProps, StateProps } from './MapView';

const mapStateToProps = (state: StoreState): StateProps => ({
  observations: state.app.observations
});

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    listObservations: () => dispatch(observationList('')),
    createObservation: observation => dispatch(observationCreate(observation))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
