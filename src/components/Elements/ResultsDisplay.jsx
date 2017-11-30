import PropTypes from 'prop-types';
import React, {Component} from 'react';
import _ from 'lodash';
import {Row, Col} from 'reactstrap';
import {connect} from 'react-redux';
import axios from 'axios';
import {formatBytes} from '../Lib/helper';
import FlagIcon from '../Helpers/FlagIcon';
import {extractHostname} from '../Lib/helper';
import {getRecentTests} from '../../actions';
//import {wptGetScreenshotImage, wptGetWaterfallImage, wptGetPageSpeedData} from "../../actions";
//import {connect} from "react-redux";

class ResultsDisplay extends Component {
  static PropTypes = {
    testData: PropTypes.object,
    screenshot: PropTypes.array,
    waterfall: PropTypes.array,
    pageSpeedData: PropTypes.array,
    isCanceled: PropTypes.bool,
    saveResultsUrl: PropTypes.string,
    websiteUrl: PropTypes.string,
    testBegin: PropTypes.bool,
    translations: PropTypes.object,
  };

  static defaultProps = {
    testData: {},
    translations: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      imageSrc: '',
      itemSaved: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testBegin && this.state.itemSaved) {
      this.setState({itemSaved: false});
    }
  }

  /*getWPTScreenshot(testId) {
    this.props.wptGetScreenshotImage('screenshot', {
      id: testId,
      options: {
        fullResolution: true,
        startRender: true,
        documentComplete: true,
        thumbnail: false,
        dataURI: true,
      },
    });
  }*/
  /*getWPTWaterfall(testId) {
    this.props.wptGetWaterfallImage('waterfall', {
      id: testId,
      options: {
        chartType: 'waterfall',
        colorByMime: false,
        chartWidth: 930,
        maxTime: 'automatic',
        requests: 'all',
        noCPU: false,
        noBandwidth: false,
        noEllipsis: false,
        noLabels: false,
      },
    });
  }*/

  /*getWPTPageSpeedData(testId) {
    this.props.wptGetPageSpeedData('pageSpeedData', {
      id: testId,
      options: {
        dryRun: false,
      },
    });
  }*/

  createLabel(label) {
    const availableCountries = [
      {name: 'Dulles', code: 'us',},
      {name: 'USA', code: 'us',},
      {name: 'USA', code: 'us',},
      {name: 'Australia', code: 'au',},
      {name: 'Argentina', code: 'ar',},
      {name: 'Brazil', code: 'br',},
      {name: 'UK', code: 'gb',},
      {name: 'Ireland', code: 'ie',},
      {name: 'France', code: 'fr',},
      {name: 'BE', code: 'be',},
      {name: 'NL', code: 'nl',},
      {name: 'Germany', code: 'de',},
      {name: 'Italy', code: 'it',},
      {name: 'Czech', code: 'cz',},
      {name: 'Poland', code: 'pl',},
      {name: 'Turkey', code: 'tr',},
      {name: 'Mauritius', code: 'mu',},
      {name: 'Israel', code: 'il',},
      {name: 'Iran', code: 'ir',},
      {name: 'UAE', code: 'ae',},
      {name: 'India', code: 'in',},
      {name: 'Singapore', code: 'sg',},
      {name: 'Indonesia', code: 'id',},
      {name: 'China', code: 'cn',},
      {name: 'Korea', code: 'kr',},
      {name: 'Japan', code: 'jp',},
      {name: 'Sydney', code: 'au',},
    ];
    const countryCode = availableCountries.filter(country => {
      const countryRegex = new RegExp(country.name);
      return label.match(countryRegex);
    })[0].code;

    return <span><FlagIcon code={countryCode}/> {label}</span>;
  }

  getTargetTTFBForStep(requestsData, rtt) {
    const connection_start = requestsData[0]['connect_start'] || null,
        connection_end = requestsData[0]['connect_end'] || null,
        connect_ms = requestsData[0]['connect_ms'] || null;

    if (connection_start !== null &&
        connection_start >= 0 &&
        connection_end !== null &&
        connection_end > connection_start) {
      rtt = connection_end - connection_start;
    }

    if (rtt > 0 && (connect_ms === 0 || connect_ms > 3000 || connect_ms < 0)) {
      rtt += 100;
    } else {
      rtt = connect_ms;
    }

    rtt = Math.max(rtt, 100);

    const ssl_ms = requestsData.some(
        (currentValue) => !(typeof currentValue.contentType !== 'undefined' &&
            (currentValue.contentType.indexOf('ocsp') !== -1 ||
                currentValue.contentType.indexOf('crl') !== -1)) &&
            Number(currentValue.is_secure) === 1)
        ? rtt : 0;

    return (rtt * 3) + ssl_ms + 100;
  }

  getTTFBScore(ttfb = null, latency = 0, requestsData) {
    let score = null; // Initial score
    if (ttfb !== null) {
      const rtt = Number(latency); // Assining latency to RTT which is Round-Trip Time, just for understanding
      const worstCase = rtt * 7 + 1000; // Calculating worst ase rtt time, with initial latency
      if (Number(ttfb) > worstCase) { // If ttfb is more then worst case, then score is 0
        score = 0;
      }

      if (score === null) {
        const target = this.getTargetTTFBForStep(requestsData, latency);
        console.log('target: ', target);
        score = Math.min(Math.max(100 - ((ttfb - target) / 10), 0), 100);
      }
    }

    return score;
  }

  getTestResultsImages(testData) {
    const
        {translations} = this.props,
        {data, latency} = testData,
        {average, median, /*runs, standardDeviation, */location} = data,
        medianFirstView = median.firstView,
        /*medianRepeatView = median.repeatView,*/
        /*medianFirstViewChecklist = medianFirstView.images.checklist,
        medianFirstViewConnectionView = medianFirstView.images.connectionView,*/
        medianFirstViewScreenShot = medianFirstView.images.screenShot,
        medianFirstViewWaterfall = medianFirstView.images.waterfall,
        /*medianRepeatViewChecklist = medianRepeatView.images.checklist,
        medianRepeatViewConnectionView = medianRepeatView.images.connectionView,
        medianRepeatViewScreenShot = medianRepeatView.images.screenShot,
        medianRepeatViewWaterfall = medianRepeatView.images.waterfall,*/
        averageFirstView = average.firstView,
        /*averageRepeatView = average.repeatView,
        standardFirstView = standardDeviation.firstView,
        standardRepeatView = standardDeviation.repeatView,
        runsData = Object.keys(runs).map(run => ({
            firstView: runs[run].firstView,
            repeatView: runs[run].repeatView
        })),*/
        requestsData = medianFirstView.requests,
        scoreLabels = {
          TTFB: translations['Time To First Byte'],
          score_cache: translations['Cache static content'],
          score_cdn: translations['Effective use of CDN'],
          score_combine: translations['Combine js and css files'],
          score_compress: translations['Compress Images'],
          score_cookies: translations['No cookies on static content'],
          score_etags: translations['Disable E-Tags'],
          score_gzip: translations['Compress Transfer'],
          'score_keep-alive': translations['Keep-alive Enabled'],
          score_minify: translations['Minify JavaScript'],
          score_progressive_jpeg: translations['Progressive JPEGs'],
        },
        importantScores = [
          'TTFB',
          'score_keep-alive',
          'score_gzip',
          'score_compression',
          'score_cache',
          'score_cdn',
        ],
        classCriteria = {
          90: 'A',
          80: 'B',
          70: 'C',
          60: 'D',
          50: 'E',
          0: 'F',
        },
        scores = Object.keys(averageFirstView)
                       .filter(key => Object.keys(scoreLabels).includes(key))
                       .map(key => {
                         const
                             score = Number(key === 'TTFB' ?
                                 this.getTTFBScore(averageFirstView[key],
                                     latency, requestsData) :
                                 (averageFirstView[key] === -1 ?
                                     0 :
                                     averageFirstView[key])).toFixed(0),
                             perKeyCritScore = Object.keys(classCriteria)
                                                     .filter(
                                                         gradeRequired => Number(
                                                             score) >= Number(
                                                             gradeRequired))
                                                     .pop(),
                             gradeClass = classCriteria[perKeyCritScore];

                         return {
                           label: scoreLabels[key],
                           score: score,
                           class: key === 'score_cdn' ?
                               (score >= 80 ? 'A' : 'NA') :
                               (gradeClass || 'NA'),
                           grade: key === 'score_cdn' ?
                               (score >= 80 ? '✓' : 'X') :
                               (gradeClass || 'NA'),
                           weight: gradeClass ? 100 : 0,
                           key: key,
                           important: importantScores.includes(key),
                         };
                       }),
        importantCriteria = scores.filter(
            score => score.important && score.grade !== 'X'),
        importantCriteriaSum = importantCriteria.reduce(
            (acc, currentValue) => Number(acc) + Number(currentValue.score), 0),
        averagePerformanceScore = (Number(importantCriteriaSum) /
            Number(importantCriteria.length)).toFixed(0),
        averagePerformanceGrade = classCriteria[Object.keys(classCriteria)
                                                      .filter(
                                                          gradeRequired => Number(
                                                              averagePerformanceScore) >=
                                                              gradeRequired)
                                                      .pop()],
        averagePerformance = {
          grade: averagePerformanceGrade,
          score: averagePerformanceScore,
        },
        requests = averageFirstView.requestsFull,
        loadTime = (averageFirstView.loadTime / 1000).toFixed(2) + ' s',
        pageSize = formatBytes(averageFirstView.bytesIn) // Size in MB
    ;

    console.log(scores);

    /*this.getWPTScreenshot(data.id);
    this.getWPTWaterfall(data.id);
    this.getWPTPageSpeedData(data.id);*/

    return {
      averagePerformance,
      requests,
      pageSize,
      loadTime,
      medianFirstViewScreenShot,
      medianFirstViewWaterfall,
      from: location,
      detailedScores: scores,
    };

  }

  /*percentColors = [
    {pct: 0.0, color: {r: 0xff, g: 0x00, b: 0}},
    {pct: 0.5, color: {r: 0xff, g: 0xff, b: 0}},
    {pct: 1.0, color: {r: 0x00, g: 0xff, b: 0}},
  ];

  getColorForPercentage(pct) {
    let i = 0;
    for (i = 1; i < this.percentColors.length - 1; i++) {
      if (pct < this.percentColors[i].pct) {
        break;
      }
    }
    const lower = this.percentColors[i - 1],
        upper = this.percentColors[i],
        range = upper.pct - lower.pct,
        rangePct = (pct - lower.pct) / range,
        pctLower = 1 - rangePct,
        pctUpper = rangePct,
        color = {
          r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
          g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
          b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
        };

    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
  }*/

  render() {
    const {testData, locations, saveResultsUrl, translations, recentTestsUrl} = this.props;
    const testDataData = testData.data;
    const {/*testInfo, */statusText} = testDataData;
    const isTestComplete = statusText === 'Test Complete';

    if (isTestComplete) {
      const {
            averagePerformance,
            requests,
            pageSize,
            loadTime,
            medianFirstViewScreenShot,
            medianFirstViewWaterfall,
            from,
            detailedScores,
          } = this.getTestResultsImages(testDataData),
          locationLabel = _.first(locations.filter(
              location => location.id === from.split(':')[0])).labelShort,
          dateTimeFormat = new Intl.DateTimeFormat().resolvedOptions(),
          currentDate = new Date();

      console.log(dateTimeFormat);

      if (!this.state.itemSaved && extractHostname(testDataData.data.url) === extractHostname(this.props.websiteUrl)) {
        axios.post(saveResultsUrl, {
          averagePerformance,
          requests,
          pageSize,
          loadTime,
          medianFirstViewScreenShot,
          medianFirstViewWaterfall,
          from,
          websiteUrl: this.props.websiteUrl,
          detailedScores,
          user_time_created: currentDate.toUTCString() + currentDate.getTimezoneOffset()/60 + ':00',
          user_time_timezone: dateTimeFormat.timeZone,
        })
             .then(response => {
               console.log(response.data);
               this.setState({itemSaved: true});
               this.props.getRecentTests('recentTests', recentTestsUrl + 10);
             })
             .catch(e => console.log(e));
      }

      return <Row>
        <Col xs={12} md={6} lg={6} xl={9}>
          <Row>
            <Col xs={12} md={12} lg={12} xl={5} className="mb-4">
              <div className="shadow-box">
                <h6>{translations['Summary']}</h6>
                <img className="img-fluid zoom-in"
                     alt={translations['Displays screenshot of website that was rendered during first run']}
                     onClick={() => this.setState(
                         {imageSrc: medianFirstViewScreenShot})}
                     src={medianFirstViewScreenShot}/>
              </div>
            </Col>
            <Col xs={12} md={12} lg={12} xl={7}>
              <Row className="results-scalar-data">
                <Col xs={12} md={12} lg={12} xl={6} className="mb-4">
                  <div className="shadow-box speed-grade">
                    <h6>{translations['Performance grade']}</h6>
                    <p>
                                                <span
                                                    data-grade={averagePerformance.grade}
                                                    className="badge badge-success p-0">{averagePerformance.grade}</span>
                      <span>{averagePerformance.score}</span>
                    </p>
                  </div>
                </Col>
                <Col xs={12} md={12} lg={12} xl={6} className="mb-4">
                  <div className="shadow-box">
                    <h6>{translations['Load time']}</h6>
                    <p><span>{loadTime}</span></p>
                  </div>
                </Col>
                <Col xs={12} md={12} lg={12} xl={6} className="mb-4">
                  <div className="shadow-box">
                    <h6>{translations['Page size']}</h6>
                    <p>
                      {pageSize}
                    </p>
                  </div>
                </Col>
                <Col xs={12} md={12} lg={12} xl={6} className="mb-4">
                  <div className="shadow-box">
                    <h6>{translations['Requests']}</h6>
                    <p>
                      {requests}
                    </p>
                  </div>
                </Col>
                <Col xs={12} md={12} lg={12} className="mb-4">
                  <div className="shadow-box">
                    <h6>{translations['Tested from']}</h6>
                    <p>
                      {from.length > 0 ? this.createLabel(locationLabel) : ''}
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col xs={12} md={6} lg={6} xl={3}>
          <div className="shadow-box">
            <h6>{translations['Waterfall']}</h6>
            <img className="img-fluid zoom-in"
                 alt={translations['Displays waterfall structure of files downloaded to load website']}
                 onClick={() => this.setState(
                     {imageSrc: medianFirstViewWaterfall})}
                 src={medianFirstViewWaterfall}/>
          </div>
        </Col>

        {this.state.imageSrc.length > 0 ?
            <Col xs={12} className="mt-4">
              <div className="shadow-box text-center">
                <h6>{translations['Image Preview']}</h6>
                <img src={this.state.imageSrc}
                     className="img-fluid zoom-out"
                     alt={translations['The placeholder for zoomed in']}
                     onClick={() => this.setState({imageSrc: ''})}
                />
              </div>
            </Col> : null}
      </Row>;
    } else {
      const counter = /\d+/.test(statusText) ? statusText.match(/\d+/)[0] : 0;
      return <Row>
        <Col xs={12}>
          <div className="shadow-box">
            <h3>{/Test Started \d+/.test(statusText) ?
                translations['Test Started %d seconds ago'].replace('%d',
                    counter) :
                (/Waiting behind %d/.test(statusText) ?
                    translations['Waiting behind %d other tests...'].replace(
                        '%d', counter) :
                    (/Waiting at the front of the queue/.test(statusText) ?
                        translations['Waiting at the front of the queue...'] :
                        statusText))} - {
              translations['test might take up to 60 or more seconds after the end of the queue']
            }</h3>
          </div>
        </Col>
      </Row>;
    }
  }
}

/*function mapStateToProps({screenshot, waterfall, pageSpeedData}) {
    return {screenshot, waterfall, pageSpeedData};
}

export default connect(mapStateToProps, {wptGetScreenshotImage, wptGetWaterfallImage, wptGetPageSpeedData})(ResultsDisplay);*/

function mapStateToProps({recentTests}) {
  return {recentTests};
}

export default connect(mapStateToProps, {getRecentTests})(ResultsDisplay);
