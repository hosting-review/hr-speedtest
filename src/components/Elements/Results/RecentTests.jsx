import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Row, Table} from 'reactstrap';
import {connect} from 'react-redux';
import {getRecentTests} from '../../../actions';
import {timeSince, extractHostname} from '../../Lib/helper';

class RecentTests extends Component {
  static PropTypes = {
    recentTests: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
    ]),
    recentTestsUrl: PropTypes.string,
    translations: PropTypes.object
  };

  static defaultProps = {
    recentTests: false,
  };

  componentWillMount() {
    this.getRecentTests(this.props, true);
  }

  getRecentTests(props, willMount = false) {
    if (willMount) {
      this.props.getRecentTests('recentTests', props.recentTestsUrl + 10);
    }
  }

  render() {
    const {recentTests, translations} = this.props;

    return <Row>
      <h3>{translations['Recent Tests']}</h3>
      <Table responsive hover>
        <tbody>
        {recentTests ?
            recentTests.map((recentTest, key) => {
              const timeAgo = timeSince(recentTest.serverAgoInSeconds, true, translations);

              return <tr key={key}>
                <td><a className="recent-tests-color" href={recentTest.url.match(/http(s)?:\/\//) ?
                    recentTest.url :
                    `http://${recentTest.url}`}
                       title={translations['Click to see website']} rel="nofollow noopener noreferrer" target="_blank">{extractHostname(recentTest.url).split('.').slice(-2).join('.')}</a></td>
                <td className="text-right recent-tests-color d-none d-md-table-cell">{timeAgo} {translations['ago']}</td>
              </tr>;
            })
            : null}
        </tbody>
      </Table>
    </Row>;
  }
}

function mapStateToProps({recentTests}) {
  return {recentTests};
}

export default connect(mapStateToProps, {getRecentTests})(RecentTests);
