import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Label, Col} from 'reactstrap';
import Select from 'react-select-plus';

class ConnectivitySelect extends Component {
  static PropTypes = {
    connectivities: PropTypes.array,
    currentConnectivity: PropTypes.string,
    translations: PropTypes.object,
  };

  static defaultProps = {
    connectivities: [
      'DSL',
      'Cable',
      'FIOS',
      'Dial',
      '3G',
      '3GFast',
      'Native',
    ],
    currentConnectivity: '',
    translations: {},
  };

  render() {
    const {connectivities, currentConnectivity, onChange, size, xl, lg, md, sm, xs, translations} = this.props;

    return <Col md={md} sm={sm} xs={xs} lg={lg} xl={xl}>
      <Label for="testConnectivity" size={size}>{translations['Connection type']}</Label>
      <Select
          id="testConnectivity"
          name="testConnectivity"
          value={currentConnectivity}
          options={connectivities.map(
              (connectivity) => ({value: connectivity, label: connectivity}))}
          onChange={onChange}
          isLoading={connectivities.length === 0}
          searchable={true}
          clearable={false}
      />
    </Col>;
  }
}

export default ConnectivitySelect;
