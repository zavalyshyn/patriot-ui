import React from 'react';
import './ButtonBox.css';

class ButtonBox extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.myRef.current) this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }

    render() {
        if (this.props.hidden) return null;

        return(
            // eslint-disable-next-line
            <a href="#" className="savebutton" ref={this.myRef} onClick={this.props.onClick}> {this.props.text} </a>
        )
    }
}

export default ButtonBox;