import React from 'react';
import './EditPolicy.css';
import SelectedBox from "./SelectedBox/SelectedBox";
import TimeRestrictedBox from "./TimeRestrictedBox/TimeRestrictedBox";
import TaskedBox from "./TaskedBox/TaskedBox";
import ButtonedBox from "./ButtonedBox/ButtonedBox";
import AddExceptionButtonBox from "../DefinePolicy/AddExceptionButtonBox/AddExceptionButtonBox";
import AddButtonBox from "../DefinePolicy/AddButtonBox/AddButtonBox";

class EditPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            source: '',
            sourcetype: '',
            attribute: '',
            destination: '',
            destinationtype: '',
            fromtime: 'any',
            tilltime: 'any',
            exception: '',
            devices: [],
            attributes: [],
            datatypeBoxHidden: true,
            destinationBoxHidden: true,
            addConditionButtonHidden: true,
            savePolicyButtonHidden: true,
            timeRestrictionHidden: false,
            missingTimeInputWarningHidden: true,
            addExceptionButtonHidden: true,
            exceptionInputFieldHidden: false,
        };
        this.sourceSelected = this.sourceSelected.bind(this);
        this.attributeSelected = this.attributeSelected.bind(this);
        this.destinationSelected = this.destinationSelected.bind(this);
        this.onTimeRestrictClicked = this.onTimeRestrictClicked.bind(this);
        this.savePolicyClicked = this.savePolicyClicked.bind(this);
        this.cancelTimeRestrClicked = this.cancelTimeRestrClicked.bind(this);
        this.fromTimeRestrSelected = this.fromTimeRestrSelected.bind(this);
        this.tillTimeRestrSelected = this.tillTimeRestrSelected.bind(this);
        this.timeInputsCorrect = this.timeInputsCorrect.bind(this);
        this.removeExceptionClicked = this.removeExceptionClicked.bind(this);
        this.onAddExceptionClicked = this.onAddExceptionClicked.bind(this);
        this.handleExceptionUrl = this.handleExceptionUrl.bind(this);
    }

    sourceSelected(value) {
        this.setState({
            source: value,
            sourcetype: this.getDeviceType(value),
            datatypeBoxHidden: false
        })
    }

    attributeSelected(value) {
        this.setState({
            attribute: value,
            destinationBoxHidden: false
        })
    }

    destinationSelected(value) {
        this.setState({
            destination: value,
            destinationtype: this.getDeviceType(value),
            addConditionButtonHidden: false,
            savePolicyButtonHidden: false
        })
    }

    onTimeRestrictClicked(event) {
        event.preventDefault();
        this.setState({
            addConditionButtonHidden: true,
            timeRestrictionHidden: false
        })
    }

    onAddExceptionClicked(event) {
        event.preventDefault();
        this.setState({
            addExceptionButtonHidden: true,
            exceptionInputFieldHidden: false
        })
    }

    removeExceptionClicked(event) {
        event.preventDefault();
        this.setState({
            exception: '',
            addExceptionButtonHidden: false,
            exceptionInputFieldHidden: true
        })
    }

    handleExceptionUrl(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    savePolicyClicked(event) {
        event.preventDefault();
        if (this.timeInputsCorrect()) {
            let policy = {
                source: this.state.source,
                sourceType: this.state.sourcetype,
                attribute: this.state.attribute,
                destination: this.state.destination,
                destinationType: this.state.destinationtype,
                timeFrom: this.state.fromtime,
                timeTill: this.state.tilltime,
                exception: this.state.exception
            };
            // this.props.onSavePolicy(policy);
            // send new policy to the user api

            fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'policies/'+this.props.userId+'/'+this.props.policy.id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(policy)
            })
                .then(() => {
                    policy.id = this.state.id;
                    this.props.onSaveEdittedPolicy(policy)
                })
        } else {
            this.setState({
                missingTimeInputWarningHidden: false
            })
        }
    }

    timeInputsCorrect() {
        let from = this.state.fromtime;
        let till = this.state.tilltime;
        if (((from==='any') && (till!=='any')) || ((from!=='any') && (till==='any'))) return false;
        return true;
    }

    cancelTimeRestrClicked(event) {
        event.preventDefault();
        this.setState({
            fromtime: 'any',
            tilltime: 'any',
            addConditionButtonHidden: false,
            timeRestrictionHidden: true
        })
    }

    fromTimeRestrSelected(value) {
        this.setState({
            fromtime: value,
            missingTimeInputWarningHidden: true
        });
    }

    tillTimeRestrSelected(value) {
        this.setState({
            tilltime: value,
            missingTimeInputWarningHidden: true
        });
    }

    getDeviceType(deviceName) {
        let type = null;
        this.state.devices.forEach((dev)=> {
            if (dev.name===deviceName) type = dev.type;
        });
        return type;
    }

    componentDidMount() {
        this.setState({
            id: this.props.policy.id,
            source: this.props.policy.source,
            sourcetype: this.props.policy.sourceType,
            attribute: this.props.policy.attribute,
            destination: this.props.policy.destination,
            destinationtype: this.props.policy.destinationType,
            fromtime: this.props.policy.timeFrom,
            tilltime: this.props.policy.timeTill,
            exception: this.props.policy.exception,
            addExceptionButtonHidden: this.props.policy.exception==='' ? false : true,
            exceptionInputFieldHidden: this.props.policy.exception==='' ? true : false
        });

        fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'devices')
            .then(res => res.json())
            .then(response => {
                this.setState({
                    devices: response.devices,
                    attributes: response.attributes
                });
            })
    }

    render() {

        let that = this;

        function extractSources(devices) {
            let sourcesList = [];
            devices.forEach((device) => {
                sourcesList.push(device.name);
            });
            return sourcesList
        }

        function extractAttributes(deviceName,devices,attributes) {
            let devicetype = null;
            devices.forEach((device) => {
                if (device.name===deviceName) devicetype=device.type;
            });
            let attributesList = [];
            attributes.forEach((attr) => {
                if (attr.devicetype===devicetype) {
                    attributesList.push(attr.name);
                }
            });
            return attributesList;
        }

        function addAnyIfNeeded(list) {
            if (list.length>1) return ['Any'].concat(list);
            return list;
        }

        function extractDestinations(attribute,devices,attributes) {
            let destinationsList = [];
            let attributeTypesList = [];
            if (attribute==='Any') {
                attributes.forEach((attr) => {
                    if (attr.devicetype===that.state.sourcetype) attributeTypesList.push(attr.type);
                })
            } else {
                attributes.forEach((attr) => {
                    if (attr.name===attribute) attributeTypesList=[attr.type];
                });
            }
            attributeTypesList.forEach((attributeType) => {
                devices.forEach((device) => {
                    if ((device.name!==that.state.source) &&
                        (device.attrTypeIn.includes(attributeType) || (device.attrTypeIn.includes('any')))) {
                        if (!destinationsList.includes(device.name)) destinationsList.push(device.name)
                    }
                });
            });

            return destinationsList;
        }

        if (this.state.devices) {
            return (
                <div className={"flow-policy"}>
                    <div className="header-wrap">
                        <a href="/" onClick={this.props.onBackClicked}>
                            <img id="backbutton" src="/images/icons/arrows/icon_arrow_left.svg" alt={"Back button"}/>
                        </a>
                        <a href="/" onClick={this.props.onHomeClicked}>
                            <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                        </a>
                    </div>
                    <div className="description">
                        Specify a restricted flow policy
                        <p className={"description-clarification"}>i.e. a flow that should <label className={'timeWarning'}><u>never</u></label> occur</p>

                    </div>

                    {/*Debuging*/}
                    {/*Current source {this.state.source}. Current sourcetype {this.state.sourcetype}.*/}
                    {/*<br/>*/}
                    {/*Current dest {this.state.destination}. Current desttype {this.state.destinationtype}*/}
                    {/*<br/>*/}
                    {/*Current attribute {this.state.attribute}*/}
                    {/*<br/>*/}
                    {/*Time restriction from {this.state.fromtime} till {this.state.tilltime}*/}

                    <TaskedBox hidden={false} step={"Step 1"} instruction={"Select a source"} />
                    <SelectedBox hidden={false} options={extractSources(this.state.devices)}
                               placeholder={this.state.source} onSelected={this.sourceSelected}/>

                    <TaskedBox hidden={false} step={"Step 2"} instruction={"Select a data type"} />
                    <SelectedBox hidden={false}
                               options={addAnyIfNeeded(extractAttributes(this.state.source,this.state.devices,this.state.attributes))}
                               placeholder={this.state.attribute} onSelected={this.attributeSelected}/>

                    <TaskedBox hidden={false} step={"Step 3"} instruction={"Select a destination"} />
                    <SelectedBox hidden={false}
                               options={extractDestinations(this.state.attribute,this.state.devices,this.state.attributes)}
                               placeholder={this.state.destination} onSelected={this.destinationSelected}/>

                    <AddButtonBox hidden={this.state.addConditionButtonHidden} text={"Restrict by time"} onClicked={this.onTimeRestrictClicked}/>

                    <TaskedBox hidden={this.state.timeRestrictionHidden} step={"Step 4"} instruction={"Restrict by time"} />
                    <TimeRestrictedBox hidden={this.state.timeRestrictionHidden}
                                        fromTimeSelected={this.fromTimeRestrSelected}
                                        tillTimeSelected={this.tillTimeRestrSelected}
                                        onCancelClicked={this.cancelTimeRestrClicked}
                                        timeFrom={this.state.fromtime} timeTill={this.state.tilltime}/>

                    <p hidden={this.state.missingTimeInputWarningHidden} className={"timeWarning"}>
                        <u>Please specify both 'from' and 'till' time</u>
                    </p>


                    <AddExceptionButtonBox hidden={this.state.addExceptionButtonHidden} text={"Add an exception"} onClicked={this.onAddExceptionClicked}/>

                    {this.state.exceptionInputFieldHidden ? null :
                    // {this.state.exception==='' ? null :
                        <div>
                            <input type="urlException" placeholder="Enter service URL" name="exception" value={this.state.exception} onChange={this.handleExceptionUrl} required />

                            <a href="/" id="buttonlink" onClick={this.removeExceptionClicked}>
                                <div id="cancelbuttontext">
                                    Remove exception
                                </div>
                                <img id="buttonimage" src="/images/icons/icon_cross_red.svg" alt={"Remove exception"}/>
                            </a>
                        </div>
                    }

                    <ButtonedBox hidden={false} text={"Save flow policy"} onClick={this.savePolicyClicked}/>

                </div>
            )
        }

        else {
            return (

                <div>
                    <div className="header-wrap">
                        <a href="/" onClick={this.props.onBackClicked}>
                            <img id="backbutton" src="/images/icons/arrows/icon_arrow_left.svg" alt={"Back button"}/>
                        </a>
                        <a href="/" onClick={this.props.onHomeClicked}>
                            <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                        </a>
                    </div>

                    <div className={'loading'}> Loading ...</div>
                    <img className={'loading'} src={'/images/loading.gif'} alt={'loading'}/>
                </div>
            )
        }

    }
}

export default EditPolicy;