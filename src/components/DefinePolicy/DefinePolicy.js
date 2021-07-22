import React from 'react';
import './DefinePolicy.css';
import TaskBox from "./TaskBox/TaskBox";
import SelectBox from "./SelectBox/SelectBox";
import AddButtonBox from "./AddButtonBox/AddButtonBox";
import ButtonBox from "./ButtonBox/ButtonBox";
import TimeRestrictionBox from "./TimeRestrictionBox/TimeRestrictionBox";
import AddExceptionButtonBox from "./AddExceptionButtonBox/AddExceptionButtonBox";

class DefinePolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: null,
            sourcetype: null,
            attribute: null,
            destination: null,
            destinationtype: null,
            exceptionUrl: '',
            fromtime: 'any',
            tilltime: 'any',
            devices: [],
            attributes: [],
            datatypeBoxHidden: true,
            destinationBoxHidden: true,
            addConditionButtonHidden: true,
            addExceptionButtonHidden: true,
            exceptionInputFieldHidden: true,
            savePolicyButtonHidden: true,
            timeRestrictionHidden: true,
            missingTimeInputWarningHidden: true
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
        this.onAddExceptionClicked = this.onAddExceptionClicked.bind(this);
        this.handleExceptionUrl = this.handleExceptionUrl.bind(this);
        this.removeExceptionClicked = this.removeExceptionClicked.bind(this);
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
            addExceptionButtonHidden: false,
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
            exceptionUrl: '',
            addExceptionButtonHidden: false,
            exceptionInputFieldHidden: true
        })
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
                exception: this.state.exceptionUrl
            };
            // this.props.onSavePolicy(policy);
            // send new policy to the user api

            fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'policies/'+this.props.userId, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(policy)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    policy.id = responseJson.id;
                    this.props.onSavePolicy(policy)
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

    handleExceptionUrl(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
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

                    <TaskBox hidden={false} step={"Step 1"} instruction={"Select a source"} />
                    <SelectBox hidden={false} options={extractSources(this.state.devices)}
                               placeholder={"Source"} onSelected={this.sourceSelected}/>

                    <TaskBox hidden={this.state.datatypeBoxHidden} step={"Step 2"} instruction={"Select a data type"} />
                    <SelectBox hidden={this.state.datatypeBoxHidden}
                               options={addAnyIfNeeded(extractAttributes(this.state.source,this.state.devices,this.state.attributes))}
                               placeholder={"Data type"} onSelected={this.attributeSelected}/>

                    <TaskBox hidden={this.state.destinationBoxHidden} step={"Step 3"} instruction={"Select a destination"} />
                    <SelectBox hidden={this.state.destinationBoxHidden}
                               options={extractDestinations(this.state.attribute,this.state.devices,this.state.attributes)}
                               placeholder={"Destination"} onSelected={this.destinationSelected}/>

                    <AddButtonBox hidden={this.state.addConditionButtonHidden} text={"Restrict by time"} onClicked={this.onTimeRestrictClicked}/>

                    <TaskBox hidden={this.state.timeRestrictionHidden} step={"Step 4"} instruction={"Restrict by time"} />
                    <TimeRestrictionBox hidden={this.state.timeRestrictionHidden}
                                        fromTimeSelected={this.fromTimeRestrSelected}
                                        tillTimeSelected={this.tillTimeRestrSelected}
                                        onCancelClicked={this.cancelTimeRestrClicked}/>

                    <p hidden={this.state.missingTimeInputWarningHidden} className={"timeWarning"}>
                        <u>Please specify both 'from' and 'till' time</u>
                    </p>

                    <AddExceptionButtonBox hidden={this.state.addExceptionButtonHidden} text={"Add an exception"} onClicked={this.onAddExceptionClicked}/>

                    {this.state.exceptionInputFieldHidden ? null :
                        <div>
                            <input type="urlException" placeholder="Enter service URL" name="exceptionUrl" value={this.state.exceptionUrl} onChange={this.handleExceptionUrl} required />

                            <a href="/" id="buttonlink" onClick={this.removeExceptionClicked}>
                            <div id="cancelbuttontext">
                                Remove exception
                            </div>
                            <img id="buttonimage" src="/images/icons/icon_cross_red.svg" alt={"Remove exception"}/>
                            </a>
                        </div>
                    }


                    <ButtonBox hidden={this.state.savePolicyButtonHidden} text={"Save flow policy"} onClick={this.savePolicyClicked}/>

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

export default DefinePolicy;