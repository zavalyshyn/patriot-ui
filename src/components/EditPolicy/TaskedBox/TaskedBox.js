import React from 'react';
import './TaskedBox.css';

class TaskedBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: this.props.step,
            instruction: this.props.instruction
        };
    }

    render() {
        if (this.props.hidden) return null;
        return (
            <div className={"task"}>
                <div className={"step"}>{this.state.step}</div>
                <div className={"instruction"}>{this.state.instruction}</div>
            </div>
        )
    }
}

export default TaskedBox;