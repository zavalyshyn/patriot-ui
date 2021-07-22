import React from 'react';
import './TextInputField.css';

class TextInputField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        let update = {
            elementType: this.props.elementType,
            value: event.target.value
        };
        this.props.onChange(update);
    }

    componentDidMount() {
        this.setState({
            value: this.props.placeholder
        })
    }


    render() {
        return (
            // <label>
                <input className={'textinput'} type={this.props.type} value={this.state.value} onChange={this.handleChange} />
            // </label>
        );
    }
}

export default TextInputField;