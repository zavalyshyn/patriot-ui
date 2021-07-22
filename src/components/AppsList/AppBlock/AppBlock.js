import React from 'react';
import './AppBlock.css';

class AppBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.appSelected = this.appSelected.bind(this);
    }

    appSelected(event) {
        event.preventDefault();
        this.props.onAppSelected(this.props.app);
    }

    render() {

        return (
            <div className="appblock">
                <a href="/" onClick={this.appSelected}>
                    <div className="app-icon-box">
                        <img src={this.props.app.icon} alt={"app-icon"}/>
                    </div>
                    <div className="app-name">{this.props.app.name} </div>
                </a>
            </div>
        )
    }
}

export default AppBlock;