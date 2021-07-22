import React from 'react';
import './AddButtonBox.css';

class AddButtonBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.myRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.myRef.current) this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }

    render() {
        if (this.props.hidden) return null;

        return(
            // eslint-disable-next-line
            <a href="#" className={"addbutton"} onClick={this.props.onClicked} ref={this.myRef}>
                <img id="buttonimage" src="/images/icons/icon_time.svg" alt={"Time Restriction logo"}/>
                <div id="buttontext">{this.props.text}</div>
            </a>
        )
    }
}

export default AddButtonBox;