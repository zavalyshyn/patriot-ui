import React from 'react';
import './PatrIoTApp.css';
import DeviceSelectBox from "./DeviceSelectBox/DeviceSelectBox";
import AppVerification from "../AppVerification/AppVerification";

class PatrIoTApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appInfoHidden: false,
            appConfigureHidden: true,
            appVerificationHidden: true,
            userDevices: [],
            appDeviceRules: [],
            appConfigs: {}
        };
        this.onAppConfigureNVerifyClicked = this.onAppConfigureNVerifyClicked.bind(this);
        this.onBackFromConfigureClicked = this.onBackFromConfigureClicked.bind(this);
        this.onUserDeviceSelected = this.onUserDeviceSelected.bind(this);
        this.onAppVerifyClicked = this.onAppVerifyClicked.bind(this);
        this.onNewAppConfig = this.onNewAppConfig.bind(this);
        this.defineDefaultAppConfigs = this.defineDefaultAppConfigs.bind(this);
    }

    onAppConfigureNVerifyClicked(event) {
        event.preventDefault();
        this.setState({
            appInfoHidden: true,
            appConfigureHidden: false
        });
        // this.props.onAppVerify();
    }

    onAppVerifyClicked(event) {
        event.preventDefault();
        this.setState({
            appInfoHidden: true,
            appConfigureHidden: true,
            appVerificationHidden: false
        })
    }

    onBackFromConfigureClicked(event) {
        event.preventDefault();
        this.setState({
            appInfoHidden: false,
            appConfigureHidden: true
        })
    }

    onUserDeviceSelected(deviceRule) {
        if (!this.state.appDeviceRules.includes(deviceRule)) {
            let currentDeviceRules = this.state.appDeviceRules.slice();
            currentDeviceRules.push(deviceRule);
            this.setState({
                appDeviceRules: currentDeviceRules
            })
        }
    }

    onNewAppConfig(update) {
        let currentAppConfigs = this.state.appConfigs;
        currentAppConfigs[update.elementType] = update.value;
        this.setState({
            appConfigs: currentAppConfigs
        })
    }

    defineDefaultAppConfigs(elementType,value) {
        let currentAppConfigs = this.state.appConfigs;
        currentAppConfigs[elementType] = value;
        this.setState({
            appConfigs: currentAppConfigs
        })
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'devices')
            .then(res => res.json())
            .then(response => {
                this.setState({
                    userDevices: response.devices
                });
            })
    }

    render() {

        const appDeviceSelectBoxes = this.props.app.devices.map((deviceType,index)=> {
            let matchingDevices = [];
            this.state.userDevices.forEach((device) => {
                if (device.type===deviceType.toLowerCase()) matchingDevices.push(device.name)
            });
            return (
                <DeviceSelectBox key={index} hidden={false} options={matchingDevices}
                           placeholder={deviceType} onSelected={this.onUserDeviceSelected}/>
            )
        });

        const deviceAccess = (this.props.app.devices.length>0) ?
            <div>
                <div className={'deviceAccess'}><u>Please select the devices for the app to control:</u></div>
                {appDeviceSelectBoxes}
            </div>
            : null;

        const appNotificationSelectBoxes = this.props.app.notifications.map((notificationType,index) => {
            let matchingDevices = [];
            this.state.userDevices.forEach((device) => {
                if (device.type==='userphone') matchingDevices.push(device.name)
            });
            let placeholder = (notificationType==="PushNotifier") ? 'Send push to' : 'Send SMS to';
            return (
                <DeviceSelectBox key={index} hidden={false} options={matchingDevices}
                                 placeholder={placeholder} onSelected={this.onUserDeviceSelected}/>
            )
        });

        // const appConfigs = this.props.app.configs.map((config,index) => {
            // this.defineDefaultAppConfigs(config.elementType,config.defaultValue);
            // if (config.elementType==='HttpRequest') {
            //     return (
            //         <div key={index} className={'appconfig'}>
            //             <u>The app will have access to the following Internet address: </u><br/>
            //             {/*{config.defaultValue.hostname + config.defaultValue.path}*/}
            //             <div className={'internetAccessConfig'}>https://{config.defaultValue.hostname}{config.defaultValue.path}</div>
            //             {/*<TextInputField placeholder={'https://'+config.defaultValue.hostname + config.defaultValue.path}/>*/}
            //         </div>
            //     )
            // }
            // if (config.elementType==='Timer') {
            //     return (
            //         <div key={index} className={'appconfig'}>
            //             Timer timeout (ms)
            //             <TextInputField type={'number'} elementType={config.elementType}
            //                             placeholder={config.defaultValue} onChange={this.onNewAppConfig}/>
            //         </div>
            //     )
            // }
            // if (config.elementType==='TimeController') {
            //     return (
            //         <div key={index} className={'appconfig'}>
            //             <u>Active time:</u>
            //             <AppTimeConfig starttime={config.defaultValue.starttime} endtime={config.defaultValue.endtime} />
            //         </div>
            //     )
            // }
            // else return null
        // });

        if (!this.state.appInfoHidden) {
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

                    <img id="appicon" src={this.props.app.icon} alt={"app icon"}/>

                    <div className="appname">{this.props.app.name} app</div>

                    <div className="appdescription">{this.props.app.description}</div>

                    {(this.props.app.internetAccess.access) ?
                                <div className={'appconfig'}>
                                    <u>The app requires access to the following Internet address: </u><br/>
                                    {/*{config.defaultValue.hostname + config.defaultValue.path}*/}
                                    <div className={'internetAccessConfig'}>https://{this.props.app.internetAccess.url}</div>
                                </div>
                                :
                                null
                    }


                    <a href="/" className="verifybutton" onClick={this.onAppConfigureNVerifyClicked}> Configure & Verify the app </a>

                    <a href="/" className="cancelbutton" onClick={this.props.onBackClicked}> Cancel </a>
                </div>
            )
        }

        if (!this.state.appConfigureHidden) {
            return (
                <div>
                    <div className="header-wrap">
                        <a href="/" onClick={this.onBackFromConfigureClicked}>
                            <img id="backbutton" src="/images/icons/arrows/icon_arrow_left.svg" alt={"Back button"}/>
                        </a>
                        <a href="/" onClick={this.props.onHomeClicked}>
                            <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                        </a>
                    </div>

                    <img id="appicon" src={this.props.app.icon} alt={"app icon"}/>

                    <div className="appname">{this.props.app.name} app</div>

                    <div className="appdescription">{this.props.app.description}</div>

                    {/*<div className={'deviceAccess'}><u>Please select the devices for the app to control:</u></div>*/}
                    {/*{appDeviceSelectBoxes}*/}

                    {deviceAccess}

                    {appNotificationSelectBoxes}

                    {/*{appConfigs}*/}


                    {/*<div>This are my app rules: {JSON.stringify(this.state.appDeviceRules)}</div>*/}

                    <a href="/" className="verifybutton" onClick={this.onAppVerifyClicked}> Verify the app </a>

                </div>
            )
        }

        if (!this.state.appVerificationHidden) {
            return(
                <AppVerification app={this.props.app} appDeviceRules={this.state.appDeviceRules}
                     onNextApp={this.props.onBackClicked} onHomeClicked={this.props.onHomeClicked}
                                 userId={this.props.userId}/>
            )
        }

    }
}

export default PatrIoTApp;