import React from 'react';
import './Button.css';

class Button extends React.Component {

    render() {
        return(
            <a href="/" className="button" onClick={this.props.onClick}> {this.props.text} </a>
        )
    }
}

export default Button;