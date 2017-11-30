import PropTypes from 'prop-types';
import React, {Component} from 'react';
import _ from 'lodash';
import {Label, Col} from 'reactstrap';
import Select from 'react-select-plus';
import FlagIcon from '../Helpers/FlagIcon';

class LocationSelect extends Component {
  static PropTypes = {
    locations: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    traslations: PropTypes.object,
  };

  static defaultProps = {
    locations: [],
    currentLocation: '',
    traslations: {},
  };

  getSanitizedLocations() {
    const locationsByGroup = {},
        {locations} = this.props;
    if (locations.length > 0) {
      locations.forEach(({group}) => {
        locationsByGroup[group] = [];
      });

      locations.forEach(({id, location, labelShort, Label, group}) => {
        locationsByGroup[group].push({
          id,
          location,
          name: `${labelShort}  - ${Label}`,
        });
      });
    }

    return locationsByGroup;
  }

  onChange(currentOption) {
    if (!_.isEmpty(currentOption)) {
      const currentTarget = this.props.locations.filter(
          location => location.id === currentOption.value)[0];
      if (this.props.hasOwnProperty('updateBrowsers')
          && !_.isEmpty(currentTarget)
          && currentTarget.hasOwnProperty('Browsers')) {
        this.props.updateBrowsers(currentTarget);
      }
    }
  }

  filterServerLocations(option, filterValue) {
    return filterValue.length === 0 || (new RegExp(filterValue, 'uig')).test(
        _.last(option.label.props.children));
  }

  createLabel(label, group) {
    const availableCountries = [
      {
        name: 'Australia',
        code: 'au',
      },
      {
        name: 'Argentina',
        code: 'ar',
      },
      {
        name: 'Brazil',
        code: 'br',
      },
      {
        name: 'UK',
        code: 'gb',
      },
      {
        name: 'Ireland',
        code: 'ie',
      },
      {
        name: 'France',
        code: 'fr',
      },
      {
        name: 'BE',
        code: 'be',
      },
      {
        name: 'NL',
        code: 'nl',
      },
      {
        name: 'Germany',
        code: 'de',
      },
      {
        name: 'Italy',
        code: 'it',
      },
      {
        name: 'Czech',
        code: 'cz',
      },
      {
        name: 'Poland',
        code: 'pl',
      },
      {
        name: 'Turkey',
        code: 'tr',
      },
      {
        name: 'Mauritius',
        code: 'mu',
      },
      {
        name: 'Israel',
        code: 'il',
      },
      {
        name: 'Iran',
        code: 'ir',
      },
      {
        name: 'UAE',
        code: 'ae',
      },
      {
        name: 'India',
        code: 'in',
      },
      {
        name: 'Singapore',
        code: 'sg',
      },
      {
        name: 'Indonesia',
        code: 'id',
      },
      {
        name: 'China',
        code: 'cn',
      },
      {
        name: 'Korea',
        code: 'kr',
      },
      {
        name: 'Japan',
        code: 'jp',
      },
      {
        name: 'Sydney',
        code: 'au',
      },

    ];
    const countryCode = group === 'North America' || label.match(/(USA|VA)/) ?
        'us' :
        availableCountries.filter(country => {
          const countryRegex = new RegExp(country.name);
          return label.match(countryRegex);
        })[0].code;

    return <span><FlagIcon code={countryCode}/> {label}</span>;
  }

  render() {
    const {size, xl, lg, md, sm, xs, currentLocation, translations} = this.props,
        locations = this.getSanitizedLocations(),
        isLoading = !_.isEmpty(locations),
        options = isLoading ? Object.keys(locations).map(group => ({
          label: group,
          options: locations[group].map(({id, name}) => ({
            label: this.createLabel(name, group),
            value: id,
          })),
        })) : [];

    return <Col md={md} sm={sm} xs={xs} lg={lg} xl={xl}>
      <Label for="testLocation" size={size}>{translations['Test from']}</Label>
      <Select
          id="testLocation"
          name="testLocation"
          required={true}
          value={currentLocation}
          options={options}
          onChange={this.onChange.bind(this)}
          isLoading={!isLoading}
          searchable={true}
          clearable={false}
          filterOption={this.filterServerLocations}
          filterValue={false}
      />
    </Col>;
  }
}

export default LocationSelect;
