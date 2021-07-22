import React from 'react';
import './DeviceSelectBox.css';

class DeviceSelectBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.placeholder,
            wasClicked: false,
            wasSelected: false,
        };
        this.myRef = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
            wasSelected: true
        });
        let deviceType = this.props.placeholder.toLowerCase();
        if (this.props.placeholder===('Send push to' || 'Send SMS to')) deviceType='pushnotifier';
        let deviceRule = {
            deviceType: deviceType,
            deviceName: event.target.value.replace(/['"]+/g, '')
        };
        this.props.onSelected(deviceRule);
    }

    onClickHandler() {
        this.setState(currentState => ({
            wasClicked: !currentState.wasClicked
        }));
    }

    componentDidUpdate() {
        if (this.myRef.current) this.myRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    render() {
        if (this.props.hidden) return null;

        const {wasClicked} = this.state;
        const {wasSelected} = this.state;

        const optionsList = [this.props.placeholder].concat(this.props.options).map((option,index) => {
            if (index===0) {
                return (
                    <option key={index} value={option} disabled>{option}</option>
                )
            }
            return (
                <option key={index} value={option}>{option}</option>
            )
        });

        return (
            <div className="selectdiv" ref={this.myRef}>
                <select className={wasSelected ? "select-selected" : (wasClicked ? "select-clicked" : "select-initial")}
                        value={this.state.value} onChange={this.handleChange} onClick={() => this.onClickHandler()}>
                    {optionsList}
                </select>
            </div>
        );
    }
}

export default DeviceSelectBox;