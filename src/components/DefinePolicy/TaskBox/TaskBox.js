import React from 'react';
import './TaskBox.css';

class TaskBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: this.props.step,
            instruction: this.props.instruction
        };
        this.myRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.myRef.current) this.myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }

    render() {
        if (this.props.hidden) return null;
        return (
            <div className={"task"} ref={this.myRef}>
                <div className={"step"}>{this.state.step}</div>
                <div className={"instruction"}>{this.state.instruction}</div>
            </div>
        )
    }
}

export default TaskBox;