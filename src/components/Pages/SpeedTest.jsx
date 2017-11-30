import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import validator from 'validator';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  FormFeedback,
} from 'reactstrap';

import {wptGetLocations, wptRunTest, wptCancelTest} from '../../actions';
import {validateUrl} from '../Lib/customProps';
import {extractHostname} from '../Lib/helper';

import LocationSelect from '../Elements/LocationSelect';
import BrowserSelect from '../Elements/BrowserSelect';
import ConnectivitySelect from '../Elements/ConnectivitySelect';
//import TestersSelect from '../Elements/TestersSelect';
import ResultsDisplay from '../Elements/ResultsDisplay';
import RecentTests from '../Elements/Results/RecentTests';

class SpeedTest extends Component {
  static propTypes = {
    wpObject: PropTypes.object,
    isCanceled: PropTypes.bool,
    testers: PropTypes.array,
    wptLocations: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.shape({
        Browsers: PropTypes.string,
        Label: PropTypes.string,
        PendingTests: PropTypes.shape(
            {
              HighPriority: PropTypes.number,
              Idle: PropTypes.number,
              LowPriority: PropTypes.number,
              Testing: PropTypes.number,
              Total: PropTypes.number,
              p1: PropTypes.number,
              p2: PropTypes.number,
              p3: PropTypes.number,
              p4: PropTypes.number,
              p5: PropTypes.number,
              p6: PropTypes.number,
              p7: PropTypes.number,
              p8: PropTypes.number,
              p9: PropTypes.number,
            }),
        group: PropTypes.string,
        id: PropTypes.string,
        labelShort: PropTypes.string,
        location: PropTypes.string,
        status: PropTypes.string,
      })),
      error: PropTypes.bool,
    }),
    wptTestStatus: PropTypes.object,
    wptRunTestResponse: PropTypes.shape({
      data: PropTypes.oneOfType([
        PropTypes.shape({
          statusCode: PropTypes.number,
          statusText: PropTypes.string,
          id: PropTypes.string,
          testInfo: PropTypes.shape({
            url: validateUrl,
            runs: PropTypes.number,
            fvonly: PropTypes.number,
            web10: PropTypes.number,
            ignoreSSL: PropTypes.number,
            label: PropTypes.string,
            priority: PropTypes.number,
            location: PropTypes.string,
            browser: PropTypes.string,
            connectivity: PropTypes.string,
            bwIn: PropTypes.number,
            bwOut: PropTypes.number,
            latency: PropTypes.number,
            plr: PropTypes.string,
            tcpdump: PropTypes.number,
            timeline: PropTypes.number,
            trace: PropTypes.number,
            bodies: PropTypes.number,
            netlog: PropTypes.number,
            standards: PropTypes.number,
            noscript: PropTypes.number,
            pngss: PropTypes.number,
            iq: PropTypes.number,
            keepua: PropTypes.number,
            mobile: PropTypes.number,
            scripted: PropTypes.number,
          }),
          testId: PropTypes.string,
          runs: PropTypes.number,
          fvonly: PropTypes.number,
          remote: PropTypes.bool,
          testsExpected: PropTypes.number,
          location: PropTypes.string,
          startTime: PropTypes.string,
          elapsed: PropTypes.number,
          completeTime: PropTypes.string,
          testsCompleted: PropTypes.number,
          fvRunsCompleted: PropTypes.number,
          rvRunsCompleted: PropTypes.number,
        }),
        PropTypes.object,
      ]),
      error: PropTypes.bool,
      isComplete: PropTypes.bool,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      websiteUrl: '',
      websiteUrlError: '',
      currentLocation: 'ec2-us-east-1',
      currentBrowser: 'Chrome',
      currentConnectivity: 'Native',
      currentTester: '',
      currentTestId: '',
      shouldUpdateTesters: false,
      testBegin: false,
    };
  }

  componentWillMount() {
    this.getWPTLocations(this.props, true);
  }

  componentWillReceiveProps(nextProps) {
    this.getWPTLocations(nextProps);
    if (!_.isEmpty(nextProps.wptRunTestResponse) &&
        this.state.currentTestId.length === 0) {
      this.setState({currentTestId: nextProps.wptRunTestResponse.data.testId});
    }

    if (nextProps.wptRunTestResponse.isComplete && this.state.testBegin) {
      this.setState({testBegin: false});
    }
  }

  getWPTLocations(props, willMount = false) {
    if (willMount) {
      this.props.wptGetLocations('wptLocations');
    }
  }

  toggleTest(update = false) {
    if (update) {
      this.setState({testBegin: !this.state.testBegin});
    }
  }

  getWPTRunTestData(event) {
    event.preventDefault();

    if (this.state.websiteUrl.length > 0 &&
        validator.isFQDN(extractHostname(this.state.websiteUrl))) {

      this.props.wptRunTest('wptRunTestResponse', {
        url: this.state.websiteUrl, options: {
          location: `${this.state.currentLocation}:${this.state.currentBrowser}`,
          connectivity: this.state.currentConnectivity,
          pageSpeed: true,
          requests: true,
          reporter: 'json',
          domains: true,
          breakDown: true,
        },
      });

      this.setState({testBegin: !this.state.testBegin, websiteUrlError: ''});

    } else if (this.state.websiteUrl.length > 0 &&
        !validator.isFQDN(extractHostname(this.state.websiteUrl))) {
      this.setState(
          {websiteUrlError: this.props.wpObject.t['URL is not fully qualified domain name']});
    } else {
      this.setState(
          {websiteUrlError: this.props.wpObject.t['URL is required']});
    }
  }

  cancelTest(event) {
    const currentTest = this.props.wptRunTestResponse.data.id;
    event.preventDefault();

    const intervalId = setInterval(function() {
      this.toggleTest(this.props.isCanceled);
      if (this.props.isCanceled) {
        clearInterval(intervalId);
      }
    }.bind(this), 500);

    this.props.wptCancelTest('isCanceled', {
      id: currentTest,
      options: {
        key: 'A.cc65d755f43d133fbf4dc36d16949d30',
      },
    });
  }

  updateBrowsers(currentTarget) {
    const currentBrowsers = currentTarget.Browsers.split(',')
                                         .map(browser => browser.trim(' '));
    this.setState({
      browsers: currentBrowsers,
      currentLocation: currentTarget.id,
      shouldUpdateTesters: true,
    });
  }

  updateWebsiteUrl(event) {
    this.setState({websiteUrl: event.target.value, shouldUpdateTesters: false});
  }

  setBrowserNameToState(option) {
    this.setState({currentBrowser: option.value, shouldUpdateTesters: false});
  }

  setConnectivityNameToState(option) {
    this.setState(
        {currentConnectivity: option.value, shouldUpdateTesters: false});
  }

  setTestersNameToState(option, getWPTTesters) {
    this.setState({currentTester: option.value, shouldUpdateTesters: false});
  }

  render() {
    const {wptLocations, isCanceled, wptRunTestResponse, wpObject} = this.props,
        {error, data} = wptLocations,
        locations = data || [],
        browsers = locations.length > 0 ?
            locations.filter(location => location.id ===
                this.state.currentLocation)[0].Browsers.split(',') :
            [],
        isTestResponseEmpty = _.isEmpty(wptRunTestResponse);

    let responseData = {},
        isInQueue = true;

    if (!isTestResponseEmpty) {
      responseData = wptRunTestResponse.data;
      isInQueue = /Waiting behind %d/.test(responseData.statusText) ||
          /Waiting at the front of the queue/.test(
              responseData.statusText);

      console.log(responseData);

    }

    return (
        <div className="web-speed-test-wrapper">
          <Form className="shadow-box">
            <FormGroup className="mb-0" row>
              <Col xl={3} lg={3} md={6} sm={6} xs={12}>
                <Label for="websiteUrl" size="md">URL</Label>
                <Input
                    valid={this.state.websiteUrlError.length === 0 ?
                        null :
                        this.state.websiteUrlError.length === 0}
                    id="websiteUrl"
                    placeholder={this.props.wpObject.t['Enter a Website URL']}
                    type="url"
                    size="md"
                    required={true}
                    onChange={this.updateWebsiteUrl.bind(this)}
                    value={this.state.websiteUrl}
                />
                <FormFeedback>{this.state.websiteUrlError}</FormFeedback>
              </Col>
              {!error && locations.length > 0 ?
                  <LocationSelect
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      size="md"
                      locations={locations}
                      currentLocation={this.state.currentLocation}
                      updateBrowsers={this.updateBrowsers.bind(this)}
                      translations={wpObject.t}
                  /> : ''}
              {!error && locations.length > 0 && browsers.length > 0 ?
                  <BrowserSelect
                      xl={2}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      size="md"
                      onChange={this.setBrowserNameToState.bind(this)}
                      browsers={browsers}
                      currentBrowser={this.state.currentBrowser}
                      translations={wpObject.t}
                  /> : ''}
              {!error && locations.length > 0 ?
                  <ConnectivitySelect
                      xl={2}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      size="md"
                      currentConnectivity={this.state.currentConnectivity}
                      onChange={this.setConnectivityNameToState.bind(this)}
                      translations={wpObject.t}
                  /> : ''}
              {/*!error && locations.length > 0 ?
                        <TestersSelect
                            currentTester={this.state.currentTester}
                            currentLocation={this.state.currentLocation}
                            shouldUpdateTesters={this.state.shouldUpdateTesters}
                            onChange={this.setTestersNameToState.bind(this)}/> : ''*/}

              <Col xl={2} lg={12} md={12} sm={12} xs={12}>
                <Label size="md">&nbsp;</Label>
                {this.state.testBegin ?
                    <Button
                        className="btn btn-warning btn-md btn-block"
                        onClick={this.cancelTest.bind(this)}
                        disabled={!isInQueue}
                        type="submit"
                    >{this.props.wpObject.t['Cancel']}
                    </Button>
                    : <Button
                        className="btn btn-success btn-md btn-block"
                        onClick={this.getWPTRunTestData.bind(this)}
                        type="submit"
                    >{this.props.wpObject.t['Check']}
                    </Button>
                }
              </Col>
            </FormGroup>
          </Form>
          <div className="pt-4">
            {!isTestResponseEmpty ?
                <ResultsDisplay
                    testBegin={this.state.testBegin}
                    websiteUrl={this.state.websiteUrl}
                    saveResultsUrl={wpObject.saveResultsUrl}
                    icCanceled={isCanceled}
                    locations={locations}
                    testData={wptRunTestResponse}
                    translations={wpObject.t}
                    recentTestsUrl={wpObject.getRecentTests}
                /> : null}
          </div>
          <div className="pt-4">
            <div className="shadow-box">
              <RecentTests
                  translations={wpObject.t}
                  recentTestsUrl={wpObject.getRecentTests}
              />
            </div>
          </div>
        </div>
    );
  }
}

function mapStateToProps({wptLocations, wptRunTestResponse, isCanceled}) {
  return {wptLocations, wptRunTestResponse, isCanceled};
}

export default connect(mapStateToProps,
    {wptGetLocations, wptRunTest, wptCancelTest})(SpeedTest);
