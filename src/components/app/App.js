import React from 'react';
import Cookies from 'universal-cookie';
// import logo from '../../logo.svg';
import './App.css';
import FlowPolicies from "../FlowPolicies/FlowPolicies";
import HomeScreen from "../HomeScreen/HomeScreen";
import AppsList from "../AppsList/AppsList";
import LoginScreen from "../LoginScreen/LoginScreen";
import RegisterScreen from "../RegisterScreen/RegisterScreen";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.cookies = new Cookies();
        let userId = this.cookies.get('userID');

        // let userId = localStorage.getItem('userID');

        if (userId) {
            // console.log(userId);
            this.state = {
                homeScreenHidden: false,
                flowPoliciesHidden: true,
                appsHidden: true,
                loginScreenHidden: true,
                registerScreenHidden: true,
                currentApp: null,
                userLoggedIn: true,
                userRegisteredSuccessMsgHidden: true,
                userId: userId
            };
        } else {
            this.state = {
                homeScreenHidden: true,
                flowPoliciesHidden: true,
                appsHidden: true,
                loginScreenHidden: false,
                registerScreenHidden: true,
                currentApp: null,
                userLoggedIn: false,
                userRegisteredSuccessMsgHidden: true,
                userId: ''
            };
        }

        // this.state = {
        //     homeScreenHidden: true,
        //     flowPoliciesHidden: true,
        //     appsHidden: true,
        //     loginScreenHidden: false,
        //     registerScreenHidden: true,
        //     currentApp: null,
        //     userLoggedIn: false,
        //     userRegisteredSuccessMsgHidden: true,
        //     userId: ''
        // };

        this.onAppSelected = this.onAppSelected.bind(this);
        this.showFlowPolicies = this.showFlowPolicies.bind(this);
        this.showApps = this.showApps.bind(this);
        this.onBackFromFlowPolicies = this.onBackFromFlowPolicies.bind(this);
        this.onBackFromApps = this.onBackFromApps.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onRegisterClicked = this.onRegisterClicked.bind(this);
        this.onBackFromRegister = this.onBackFromRegister.bind(this);
        this.newUserRegistered = this.newUserRegistered.bind(this);
        this.onBackFromLogin = this.onBackFromLogin.bind(this);

    }

    onAppSelected(app) {
        // console.log(JSON.stringify(app, null, 2));
        this.setState({
            currentApp: app,
        })
    }

    onBackFromFlowPolicies(event) {
        event.preventDefault();
        this.setState({
            flowPoliciesHidden: true,
            homeScreenHidden: false
        })
    }

    onBackFromApps(event) {
        event.preventDefault();
        this.setState({
            appsHidden: true,
            homeScreenHidden: false
        })
    }

    onBackFromLogin(event) {
        event.preventDefault();
    }

    showHome(event) {
        event.preventDefault();
        // load home screen
        if (this.state.userLoggedIn) {
            this.setState({
                homeScreenHidden: false
            })
        } else {
            this.setState({
                loginScreenHidden: true
            })
        }
    }

    showFlowPolicies(event) {
        event.preventDefault();
        this.setState({
            homeScreenHidden: true,
            flowPoliciesHidden: false
        })
    }

    showApps(event) {
        event.preventDefault();
        this.setState({
            homeScreenHidden: true,
            appsHidden: false
        })
    }

    onLogin(userId) {
        this.cookies.set('userID', userId, { path: '/', expires: new Date(2020,12,31) });
        // localStorage.setItem( 'userID', userId );
        this.setState({
            loginScreenHidden: true,
            userId: userId,
            userLoggedIn: true,
            homeScreenHidden: false
        })
    }

    onRegisterClicked(event) {
        event.preventDefault();
        this.setState({
            loginScreenHidden: true,
            registerScreenHidden: false
        })
    }

    onBackFromRegister(event) {
        event.preventDefault();
        this.setState({
            registerScreenHidden: true,
            loginScreenHidden: false
        })
    }

    newUserRegistered() {
        this.setState({
            userRegisteredSuccessMsgHidden: false,
            registerScreenHidden: true,
            loginScreenHidden: false,
        })
    }

    onLogout(event) {
        // localStorage.clear();
        this.cookies.remove('userID');
    }

    render() {

        if (!this.state.homeScreenHidden) {
            return (
                <HomeScreen flowPoliciesClicked={this.showFlowPolicies} appsClicked={this.showApps}
                            onLogout={this.onLogout}/>
            )
        }

        if (!this.state.flowPoliciesHidden) {
            return (
                <FlowPolicies userId={this.state.userId} onBackClicked={this.onBackFromFlowPolicies}
                              onHomeClicked={this.onBackFromFlowPolicies}/>
            )
        }

        if (!this.state.appsHidden) {
            return (
                <AppsList userId={this.state.userId} onBackClicked={this.onBackFromApps}
                          onHomeClicked={this.onBackFromApps} onAppSelected={this.onAppSelected}/>
            )
        }

        if (!this.state.loginScreenHidden) {
            return (
                <div>
                    <div className="header-wrap">
                        <a href="/" onClick={this.onBackFromLogin}>
                            <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                        </a>
                    </div>
                    <LoginScreen onRegisterClicked={this.onRegisterClicked} onLogin={this.onLogin}
                        afterRegMsg={this.state.userRegisteredSuccessMsgHidden}/>
                </div>
            )
        }

        if (!this.state.registerScreenHidden) {
            return (
                <div>
                    <div className="header-wrap">
                        <a href="/" onClick={this.onBackFromRegister}>
                            <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                        </a>
                    </div>
                    <RegisterScreen onNewUserRegistered={this.newUserRegistered} onBackClicked={this.onBackFromRegister}/>
                </div>

            )
        }
    }
}

export default App;