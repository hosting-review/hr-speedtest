import PropTypes from 'prop-types';
import React, {Component} from 'react';
import _ from 'lodash';
import {FormGroup, Label, Input, Col} from 'reactstrap';
import {wptGetTesters} from "../../actions";
import {connect} from "react-redux";

class TestersSelect extends Component {
    static PropTypes = {
        testers: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        updateItem: PropTypes.func.isRequired,
        currentTester: PropTypes.string,
        currentLocation: PropTypes.string,
        shouldUpdateTesters: PropTypes.bool
    };

    static defaultProps = {
        testers: [],
        currentTester: '',
        currentLocation: '',
        shouldUpdateTesters: false
    };

    constructor(props) {
        super(props);
        this.state = {
            shouldUpdateTesters: false
        };
    }

    componentWillMount() {
        this.getWPTesters(true);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.shouldUpdateTesters) {
            this.setState({shouldUpdateTesters: true});
            this.getWPTesters(this.state.shouldUpdateTesters);
        }
    }

    getWPTesters(willMount = false) {
        if (willMount) {
            this.props.wptGetTesters('testers', {id: this.props.currentLocation});
            this.setState({shouldUpdateTesters: false});
        }
    }

    render() {
        const {testers, onChange, currentTester} = this.props;
        return <FormGroup row>
            <Label for="testTesters" size="lg" sm={2} xs={12}>Testers Select</Label>
            <Col sm={10} xs={12}>
                <Input type="select"
                       size="lg"
                       id="testTesters"
                       className="form-control"
                       required={true}
                       onChange={(event) => onChange(event, this.getWPTesters.bind(this))}
                       defaultValue={currentTester}
                >
                    <option disabled={true}>Please select Tester</option>
                    {!_.isEmpty(testers) ?
                        (!_.isArray(testers.data)
                            ?
                            <option
                                key={testers.data.id}
                                value={testers.data.pc}>IP: {testers.data.ip}; PC: {testers.data.pc};
                                Screen: {testers.data.screenwidth}x{testers.data.screenheight};
                                Disk: {testers.data.freedisk}</option>
                            :
                            testers.data.map(
                                ({busy, ip, cpu, ec2, elapsed, errors, freedisk, id, last, pc, screenheight, screenwidth, version}) =>
                                    <option key={id}
                                            value={id}>IP: {ip}; PC: {pc}; Screen: {screenwidth}x{screenheight};
                                        Disk: {freedisk}</option>)) : ''}
                </Input>
            </Col>
        </FormGroup>;
    }
}

function mapStateToProps({testers}) {
    return {testers};
}

export default connect(mapStateToProps, {wptGetTesters})(TestersSelect);
