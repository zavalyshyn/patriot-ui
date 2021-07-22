import Button from "../Button/Button";
import React from "react";
import './LoginScreen.css';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            wrongLoginDetailsErrorHidden: true,
        };
        this.onLoginClicked = this.onLoginClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onLoginClicked(event) {
        event.preventDefault();
        if (!this.state.username && !this.state.password) return null;
        fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'users/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data===-1) {
                    // console.log('Error: Wrong username or password');
                    this.setState({
                        wrongLoginDetailsErrorHidden: false
                    })
                }
                else {
                    // console.log('Success:', 'correct login and password');
                    this.props.onLogin(data.id);
                }
            })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return(
            <div className={'loginscreen'}>
                {/*<label><b>Username</b></label> <br/> <br/>*/}
                {this.props.afterRegMsg ? null : <p style={{textAlign: 'center', marginTop: '20px'}}>Success! Now login with your new user account</p>}
                {this.state.wrongLoginDetailsErrorHidden ? null : <p className={'error'}>Wrong username or password</p>}
                <input type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange} required />
                <br/><br/>
                {/*<label><b>Password</b></label> <br/> <br/>*/}
                <input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} required />

                <br/><br/> <br/>
                <Button text={"Login"} onClick={this.onLoginClicked}/>
                <br/>
                or
                <br/> <br/>
                {/*<Button text={"Register"} onClick={this.props.onRegisterClicked}/>*/}
                <a href="/" onClick={this.props.onRegisterClicked}> <p className={'greentext'}><u>Register</u></p> </a>
            </div>
        )
    }
}

export default LoginScreen;