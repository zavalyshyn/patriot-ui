import React from 'react';
import './ConflictingFlowPolicy.css';

class ConflictingFlowPolicy extends React.Component {
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
                <div className={'conflictingpolicydiv'}>
                    Privacy policy: <br/><br/>
                    <div className={'confelements'}>
                        <div className={'confflowelement'}><span>{this.props.policy.source}</span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Data type: <br/> <b className={'redtext'}>{this.props.policy.attribute}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Destination: <br/> <b className={'redtext'}>{this.props.policy.destination}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}>
                            <span>Time: <br/> From <b className={'redtext'}>{this.props.policy.timeFrom}</b> <br/> To <b className={'redtext'}>{this.props.policy.timeTill}</b></span>
                        </div>
                    </div>
                    <div className={'exceptionDiv'}>
                       {this.props.policy.exception ? <b > Exception: {this.props.policy.exception}</b> : null}
                    </div>
                    {/*<div className={'buttonsdiv'}>*/}
                    {/*    <a href="/" className="editbutton" onClick={this.onEditPolicy}>Edit</a>*/}
                    {/*    <a href="/" className="removebutton" onClick={this.onRemovePolicy}>Remove</a>*/}
                    {/*</div>*/}
                </div>
            );
        }
        else {
            return(
                <div className={'conflictingpolicydiv'}>
                    Privacy policy: <br/><br/>
                    <div className={'confelements'}>
                        <div className={'confflowelement'}><span>{this.props.policy.source}</span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Data type: <b className={'redtext'}>{this.props.policy.attribute}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Destination: <b className={'redtext'}>{this.props.policy.destination}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}>
                            <span>Time: From <b className={'redtext'}>{this.props.policy.timeFrom}</b> To <b className={'redtext'}>{this.props.policy.timeTill}</b></span>
                        </div>
                    </div>
                    <div className={'exceptionDiv'}>
                        {this.props.policy.exception ? <b > Exception: {this.props.policy.exception}</b> : null}
                    </div>
                    {/*<div className={'buttonsdiv'}>*/}
                    {/*    <a href="/" className="editbutton" onClick={this.onEditPolicy}>Edit</a>*/}
                    {/*    <a href="/" className="removebutton" onClick={this.onRemovePolicy}>Remove</a>*/}
                    {/*</div>*/}
                </div>
            );
        }




    }
}

export default ConflictingFlowPolicy;