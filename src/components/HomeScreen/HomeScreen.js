import Button from "../Button/Button";
import React from "react";
import './HomeScreen.css'

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginScreenHidden: false,
            registerScreenHidden: true,
            userLoggedIn: false,
            userRegisteredSuccessMsgHidden: true,
            userId: ''
        };
        this.onHomeClicked = this.onHomeClicked.bind(this);
        this.newUserRegistered = this.newUserRegistered.bind(this);
        this.onBackFromRegister = this.onBackFromRegister.bind(this);
        this.onRegisterClicked = this.onRegisterClicked.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    onHomeClicked(event) {
        event.preventDefault();
    }

    newUserRegistered() {
        this.setState({
            userRegisteredSuccessMsgHidden: false,
            registerScreenHidden: true,
            loginScreenHidden: false,
        })
    }

    onBackFromRegister(event) {
        event.preventDefault();
        this.setState({
            registerScreenHidden: true,
            loginScreenHidden: false
        })
    }

    onRegisterClicked(event) {
        event.preventDefault();
        this.setState({
            loginScreenHidden: true,
            registerScreenHidden: false
        })
    }

    onLogin(userId) {
        this.setState({
            loginScreenHidden: true,
            userId: userId,
            userLoggedIn: true
        })
    }

    render() {
        return(
            <div className={'Home'}>

                <div className="header-wrap">
                    <a href="/" onClick={this.onHomeClicked}>
                        <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                    </a>
                    {/*<a href="/" className={'logoutButton'} onClick={this.props.onLogout}> Log out </a>*/}
                </div>

                <br/><br/>
                <Button text={'My Privacy Policies'} onClick={this.props.flowPoliciesClicked}/>
                <br/><br/>
                <Button text={'My Apps'} onClick={this.props.appsClicked}/>

                <br/><br/><br/>
                <a href="/" className={'logoutButton'} onClick={this.props.onLogout}> Log out </a>

            </div>
        )
    }
}

export default HomeScreen;