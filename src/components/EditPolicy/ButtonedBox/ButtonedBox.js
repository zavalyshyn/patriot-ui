import React from 'react';
import './ButtonedBox.css';

class ButtonedBox extends React.Component {
    render() {
        if (this.props.hidden) return null;

        return(
            // eslint-disable-next-line
            <a href="#" className="savebutton" onClick={this.props.onClick}> {this.props.text} </a>
        )
    }
}

export default ButtonedBox;