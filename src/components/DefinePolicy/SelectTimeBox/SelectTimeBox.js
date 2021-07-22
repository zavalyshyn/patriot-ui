import React from 'react';
import './SelectTimeBox.css';

class SelectTimeBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.placeholder,
            wasClicked: false,
            wasSelected: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
            wasSelected: true
        });
        // alert("You selected " + event.target.value);
        this.props.onSelected(event.target.value);
    }

    onClickHandler() {
        this.setState(currentState => ({
            wasClicked: !currentState.wasClicked
        }));
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
            <div className="timeselectdiv">
                <select className={wasSelected ? "timeselect-selected" : (wasClicked ? "timeselect-clicked" : "timeselect-initial")}
                        value={this.state.value} onChange={this.handleChange} onClick={() => this.onClickHandler()}>
                    {optionsList}
                </select>
            </div>
        );
    }
}

export default SelectTimeBox;