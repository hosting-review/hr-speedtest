import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Label, Col} from 'reactstrap';
import Select from 'react-select-plus';

class BrowserSelect extends Component {
  static PropTypes = {
    browsers: PropTypes.array,
    currentBrowser: PropTypes.string,
    translations: PropTypes.object,
  };

  static defaultProps = {
    browsers: ['Safari', 'Firefox'],
    currentBrowser: '',
    translations: {},
  };

  render() {
    const {browsers, currentBrowser, onChange, size, xl, lg, md, sm, xs, translations} = this.props;

    return <Col md={md} sm={sm} xs={xs} lg={lg} xl={xl}>
      <Label for="testBrowser" size={size}>{translations['Browser']}</Label>
      <Select
          id="testBrowser"
          name="testBrowser"
          value={currentBrowser}
          options={browsers.map(
              (browser) => ({value: browser, label: browser}))}
          onChange={onChange}
          isLoading={browsers.length === 0}
          searchable={true}
          clearable={false}
      />
    </Col>;
  }
}

export default BrowserSelect;
