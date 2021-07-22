import React from 'react';
import './FlowPolicy.css';

class FlowPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onEditPolicy = this.onEditPolicy.bind(this);
        this.onRemovePolicy = this.onRemovePolicy.bind(this);
    }

    onEditPolicy(event) {
        event.preventDefault();
        this.props.onEditPolicy(this.props.policy);
    }

    onRemovePolicy(event) {
        event.preventDefault();
        this.props.onRemovePolicy(this.props.policy.id);
    }

    componentDidMount() {
     }


    render() {

        let width = window.innerWidth;
        if (width > 440) {
            return(
                <div className={'policydiv'}>
                    <div className={'elements'}>
                        <div className={'flowelement'}><span>{this.props.policy.source}</span></div>
                        <div className="vl"></div>
                        <div className={'flowelement'}><span>Data type: <br/> <b className={'greentext'}>{this.props.policy.attribute}</b></span></div>
                        <div className="vl"></div>
                        <div className={'flowelement'}><span>Destination: <br/> <b className={'greentext'}>{this.props.policy.destination}</b></span></div>
                        <div className="vl"></div>
                        <div className={'flowelement'}>
                            <span>Time: <br/> From <b className={'greentext'}>{this.props.policy.timeFrom}</b> <br/> To <b className={'greentext'}>{this.props.policy.timeTill}</b></span>
                        </div>
                    </div>

                    <div className={'exceptionDiv'}>
                        {this.props.policy.exception ? <b > Exception: <b className={'greentext'}>{this.props.policy.exception}</b> </b>: null}
                    </div>


                    {/*<div className={'exceptionDiv'}>*/}
                    {/*    Exception: {this.props.policy.exception ? <b className={'greentext'}>{this.props.policy.exception}</b> : <b className={'greentext'}>none</b>}*/}
                    {/*</div>*/}
                    <div className={'buttonsdiv'}>
                        <a href="/" className="editbutton" onClick={this.onEditPolicy}>Edit</a>
                        <a href="/" className="removebutton" onClick={this.onRemovePolicy}>Remove</a>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className={'policydiv'}>
                    <div className={'elements'}>
                        <div className={'flowelement'}><span>{this.props.policy.source}</span></div>
                        <div className="vl"></div>
                        <div className={'flowelement'}><span>Data type: <b className={'greentext'}>{this.props.policy.attribute}</b></span></div>
                        <div className="vl"></div>
                        <div className={'flowelement'}><span>Destination: <b className={'greentext'}>{this.props.policy.destination}</b></span></div>
                        <div className="vl"></div>
                        <div className={'flowelement'}>
                            <span>Time: <br/> From <b className={'greentext'}>{this.props.policy.timeFrom}</b> <br/> To <b className={'greentext'}>{this.props.policy.timeTill}</b></span>
                        </div>
                    </div>
                    <div className={'exceptionDiv'}>
                        {this.props.policy.exception ? <b > Exception: <b className={'greentext'}>{this.props.policy.exception}</b> </b>: null}
                    </div>
                    {/*<div className={'exceptionDiv'}>*/}
                    {/*    Exception: {this.props.policy.exception ? <b className={'greentext'}>{this.props.policy.exception}</b> : <b className={'greentext'}>none</b>}*/}
                    {/*</div>*/}
                    <div className={'buttonsdiv'}>
                        <a href="/" className="editbutton" onClick={this.onEditPolicy}>Edit</a>
                        <a href="/" className="removebutton" onClick={this.onRemovePolicy}>Remove</a>
                    </div>
                </div>
            );
        }




    }
}

export default FlowPolicy;