import React from 'react';
import './AppVerification.css';
import ConflictingFlowPolicy from "../ConflictingFlowPolicy/ConflictingFlowPolicy";
import ConflictingAppFlow from "../ConflictingAppFlow/ConflictingAppFlow";

class AppVerification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userPolicies: null,
            appFlows: null,
            appInternetAccess: null,
            result: null
        };
        this.convertPMAM = this.convertPMAM.bind(this);
    }

    componentDidMount() {
        // fetch user defined policies
        fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'policies/'+this.props.userId)
            .then(res => res.json())
            .then(policies => {
                this.setState({
                    userPolicies: policies,
                });
                // console.log("User policies: ",JSON.stringify(policies,null,2));
                // console.log("App devices configs:\n",JSON.stringify(this.props.appDeviceRules,null,2));
            });
        // fetch app flows facts
        fetch(process.env.REACT_APP_PATRIOT_API_URL+'apps/'+this.props.app.id+'/flows')
            .then(res => res.json())
            .then(appFlows => {
                this.setState({
                    appFlows: appFlows
                });
                // console.log("App flows: \n",appFlows);
            })
        // fetch app internet access info
        fetch(process.env.REACT_APP_PATRIOT_API_URL+'apps/'+this.props.app.id+'/internetAccess')
            .then(res => res.json())
            .then(appInternetAccess => {
                this.setState({
                    appInternetAccess: appInternetAccess
                });
                // console.log("App appInternetAccess: \n",appInternetAccess);
            })
    }

    flowTimeOverlapsWithPolicy(flowStartHour,flowStartMin,flowEndHour,flowEndMin,polStart,polEnd) {
        if ((polStart || polEnd)==='any') return true;
        if ((flowStartHour || flowEndHour) === '_') return true;
        let polStart24 = this.convertPMAM(polStart);
        let polEnd24 = this.convertPMAM(polEnd);
        let polStartTS = Date.parse(new Date(2019,9,1,polStart24.hour,polStart24.min));
        let polEndTS = Date.parse(new Date(2019,9,1,polEnd24.hour,polEnd24.min));
        let flowStartTS = Date.parse(new Date(2019,9,1,flowStartHour,flowStartMin));
        let flowEndTS = Date.parse(new Date(2019,9,1,flowEndHour,flowEndMin));
        if ((polStartTS===flowStartTS) && (polEndTS===flowEndTS)) return true;
        if (polStartTS <= polEndTS) {
            if (((flowStartTS > polStartTS) && (flowStartTS < polEndTS)) ||
                ((flowEndTS > polStartTS) && (flowEndTS < polEndTS)) ||
                ((flowStartTS < polStartTS) && (flowEndTS > polEndTS)) ||
                ((flowStartTS < polStartTS) && (flowEndTS < flowStartTS))) return true;
        } else {
            if (((flowStartTS < polStartTS) && (flowEndTS > polStartTS)) ||
                ((flowStartTS < polStartTS) && (flowEndTS > polStartTS)) ||
                ((flowStartTS < polStartTS) && (flowEndTS < flowStartTS)) ||
                ((flowStartTS > polStartTS)) || ((flowEndTS > polStartTS))) return true;
        }
        return false
    }

    sinkIsException(appInternetAccess,exception) {
        let url = appInternetAccess.url;
        if ((url==='') || (exception==='')) return false;
        return exception === url;
    }

    convertPMAM(timestamp) {
        if (timestamp==='any') return {hour: '_', min: '_'};
        let hours = Number(timestamp.match(/^(\d+)/)[1]);
        let minutes = Number(timestamp.match(/:(\d+)/)[1]);
        let AMPM = timestamp.match(/\s(.*)$/)[1];
        if(AMPM === "PM" && hours<12) hours = hours+12;
        if(AMPM === "AM" && hours===12) hours = hours-12;
        let sHours = hours.toString();
        let sMinutes = minutes.toString();
        // if(hours<10) sHours = "0" + sHours;       // we don't need now
        // if(minutes<10) sMinutes = "0" + sMinutes; // we don't need now
        return {hour: sHours, min: sMinutes};
    }

    // componentDidUpdate() {
    //     document.body.style.backgroundColor = "#00A551";
    // }

    componentWillUnmount(){
        document.body.style.backgroundColor = null;
    }

    render() {
        let userPolicies = this.state.userPolicies;
        let appFlows = this.state.appFlows;
        let appInternetAccess = this.state.appInternetAccess;
        let appDevices = this.props.appDeviceRules;
        let conflictingPolicies = [];

        if (userPolicies && appFlows && appInternetAccess) {

            if (this.props.app.internetAccess.access) {
                appDevices.push({deviceType:'httprequest', deviceName:'httprequest'});
            }

            // console.log("App flows: \n",JSON.stringify(appFlows, null, 2));

            appFlows.forEach((flow)=> {

                let flowSource = flow.source;
                let flowAttr = flow.attribute;
                let flowSink = flow.sink;
                let flowStartHour = flow.hourFrom;
                let flowStartMin = flow.minFrom;
                let flowEndHour = flow.hourTill;
                let flowEndMin = flow.minTill;

                userPolicies.forEach((policy) => {
                    let polAttr = policy.attribute.toLowerCase().replace(/\s+/g, '_');
                    let polSource = (policy.source==='Internet') ? policy.sourceType : policy.source.replace(/['"]+/g, '');
                    let polSink = (policy.destination==='Internet') ? policy.destinationType : policy.destination.replace(/['"]+/g, '');
                    let polStartTime = policy.timeFrom;
                    let polEndTime = policy.timeTill;
                    let polSinkType = (policy.destinationType==='userphone') ? 'pushnotifier' : policy.destinationType;
                    let polException = policy.exception;

                    // if ((policy.sourceType===flowSource) && (policy.destinationType===flowSink)
                    if ((policy.sourceType===flowSource) && (polSinkType===flowSink)
                    && ((policy.attribute==='Any') || (polAttr===flowAttr))
                    && ((appDevices.filter(dev => ((dev.deviceType === policy.sourceType) && (dev.deviceName === polSource))).length > 0)
                    // && (appDevices.filter(dev => ((dev.deviceType === policy.destinationType) && (dev.deviceName === polSink))).length > 0))
                    && (appDevices.filter(dev => ((dev.deviceType === polSinkType) && (dev.deviceName === polSink))).length > 0))
                    && this.flowTimeOverlapsWithPolicy(flowStartHour,flowStartMin,flowEndHour,flowEndMin,polStartTime,polEndTime)
                    && (!this.sinkIsException(appInternetAccess,polException))) {
                        console.log(`CONFLICT: \n Policy ${JSON.stringify(policy)} conflicts with app flow \n ${JSON.stringify(flow)}`);
                        // conflictingPolicies.push(policy)
                        let conflictObject = {
                            policy: policy,
                            flow: flow,
                            internetAccess: appInternetAccess
                        };
                        conflictingPolicies.push(conflictObject)
                    }
                    else {
                        console.log(`NO CONFLICT: \n Policy ${JSON.stringify(policy)} does not conflict with app flow \n ${JSON.stringify(flow)}`);
                    }
                })
            });

            if (conflictingPolicies.length > 0) {
                // red background
                document.body.style.backgroundColor = "#E05E37";
                return (
                    <div className={'failure'}>
                        <div className="header-wrap">
                            <a href="/" onClick={this.props.onHomeClicked} >
                                <img id="logo" src="/images/patrIoT_logo2.svg" alt={"PatrIoT logo"}/>
                            </a>
                        </div>

                        <div className="smiley">
                            <img src="/images/icons/face_sad.svg" alt={'failure icon'}/>
                        </div>

                        <div className="result">
                            {this.props.app.name} app failed privacy policy verification
                            <br/> <br/>
                            Conflicting privacy policies:
                        </div>


                        {/*{conflictingPolicies.map((policy,index) => {*/}
                        {/*    return (*/}
                        {/*        <ConflictingFlowPolicy key={index} policy={policy} onEditPolicy={this.editPolicy} onRemovePolicy={this.removePolicy}/>*/}
                        {/*    )*/}
                        {/*})}*/}

                        {conflictingPolicies.map((conflictObject,index) => {
                            return (
                                <div>
                                    <ConflictingFlowPolicy key={index} policy={conflictObject.policy} onEditPolicy={this.editPolicy} onRemovePolicy={this.removePolicy}/>

                                    <ConflictingAppFlow key={index} flow={conflictObject.flow}
                                                        flowSource={conflictObject.policy.source} flowDestination={conflictObject.policy.destination}
                                                        flowDatatype={conflictObject.flow.attribute}
                                                    appInternetAccess={conflictObject.internetAccess}/>
                                </div>
                            )
                        })}

                        <div className="conf-holder">
                            <a href="/" onClick={this.props.onHomeClicked} id="buttonlink">
                                <div id="polbuttontext">
                                    Change privacy policies
                                </div>
                                <img id="polbuttonimage" src="/images/icons/arrows/icon_arrow_right.svg" alt={'change policies button'}/>
                            </a>
                        </div>

                        <div className="cancel-holder">
                            <a href="/" id="buttonlink" onClick={this.props.onNextApp}>
                                <div id="polbuttontext">
                                    Cancel
                                </div>
                                <img id="polbuttonimage" src="/images/icons/icon_cross_white.svg" alt={'Cancel'}/>
                            </a>
                        </div>
                    </div>
                )
            }
            else {
                document.body.style.backgroundColor = "#00A551";
                return (
                    <div className={"success"}>
                        {/*App flow rules: {JSON.stringify(this.props.appDeviceRules)}*/}
                        {/*App flow model: {JSON.stringify(this.state.appModel)}*/}
                        <div className="header-wrap">
                            <a href="/" onClick={this.props.onHomeClicked}>
                                <img id="logo" src="/images/patrIoT_logo2.svg" alt={"PatrIoT logo"}/>
                            </a>
                        </div>

                        <div className="smiley">
                            <img src="/images/icons/face_smile.svg" alt={'Success'}/>
                        </div>

                        <div className="result">
                            {this.props.app.name} app passed privacy policy verification successfully
                        </div>


                        <div className="conf-holder">
                            <a href="/" id="conflink" onClick={this.props.onNextApp}>
                                <div id="conftext">
                                    Configure & Install other app
                                </div>
                                <img id="arrow-right" src="/images/icons/arrows/icon_arrow_right.svg" alt={'Go back to apps list'}/>
                            </a>
                        </div>
                    </div>
                )
            }

        } else {
            return (
                <div>
                    <div className="header-wrap">
                        <a href="/" >
                            <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                        </a>
                    </div>

                    <div className={'loading'}> This may take some time. Please stand by ...</div>
                    {/*<img className={'loading'} src={'/images/loading.gif'} alt={'loading'}/>*/}
                    <img className={'loading'} src={'/images/icons/loading.svg'} alt={'loading'}/>
                </div>
            )
        }

    }
}

export default AppVerification;