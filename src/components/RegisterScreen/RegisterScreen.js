import Button from "../Button/Button";
import React from "react";
import './RegisterScreen.css';

class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            password2: '',
            wrongPasswordErrorHidden: true,
            userExistsErrorHidden: true,
        };
        this.onRegisterClicked = this.onRegisterClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onRegisterClicked(event) {
        event.preventDefault();
        if (!this.state.username || !this.state.password) return null;
        // check if two entered passwords match
        if (this.state.password!==this.state.password2) {
            this.setState({
                wrongPasswordErrorHidden: false
            })
        } else {
            let userData = { username: this.state.username, password: this.state.password};
            fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data===-1) {
                        // console.log('Error: User exists already');
                        this.setState({
                            userExistsErrorHidden: false
                        })
                    }
                    else {
                        // console.log('Success:', data);
                        this.props.onNewUserRegistered();
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            wrongPasswordErrorHidden: true,
            userExistsErrorHidden: true
        });
    }

    render() {
        return(
            <div className={'registerscreen'}>
                {/*<label><b>Username</b></label> <br/> <br/>*/}
                {(this.state.userExistsErrorHidden) ? null : <p className={'error'}> A specified username is already taken </p>}
                <input type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange} required />
                <br/><br/>
                {/*<label><b>Password</b></label> <br/> <br/>*/}
                <input type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} required />
                <br/><br/>
                {/*<label><b>Password</b></label> <br/> <br/>*/}
                {(this.state.wrongPasswordErrorHidden) ? null : <p className={'error'}> Passwords do not match </p>}
                <input type="password" placeholder="Repeat your password" name="password2" value={this.state.password2} onChange={this.handleChange} required />

                <br/><br/> <br/>
                <Button text={"Register"} onClick={this.onRegisterClicked}/>

                <a href="/" className="cancelbutton" onClick={this.props.onBackClicked}> Cancel </a>
                {/*<Button text={"Cancel"} onClick={this.props.onBackClicked}/>*/}

            </div>
        )
    }
}

export default RegisterScreen;