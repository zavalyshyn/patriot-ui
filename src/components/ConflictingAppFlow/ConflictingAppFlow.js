import React from 'react';
import './ConflictingAppFlow.css';

class ConflictingAppFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
    }


    render() {

        let width = window.innerWidth;
        if (width > 440) {
            return(
                <div className={'conflictingpolicydiv'}>
                    Conflicting app flow: <br/><br/>
                    <div className={'confelements'}>
                        <div className={'confflowelement'}><span>{this.props.flowSource}</span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Data type: <br/> <b className={'redtext'}>{this.props.flowDatatype}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Destination: <br/> <b className={'redtext'}>{this.props.flowDestination}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}>
                            <span>Time: <br/> From <b className={'redtext'}>
                                {this.props.flow.hourFrom==='_' ? 'Any' : this.props.flow.hourFrom+':'+this.props.flow.minFrom}
                            </b>
                                <br/> To <b className={'redtext'}>
                                    {this.props.flow.hourTill==='_' ? 'Any' : this.props.flow.hourTill+':'+this.props.flow.minTill}
                            </b></span>
                        </div>
                    </div>
                    {(this.props.flowDestination==='Internet' && this.props.appInternetAccess.url!=='') ?
                        <div className={'exceptionDiv'}>
                            App is trying to access : <b>{this.props.appInternetAccess.url}</b>
                        </div>
                        : null
                    }
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
                    Conflicting app flow: <br/><br/>
                    <div className={'confelements'}>
                        <div className={'confflowelement'}><span>{this.props.flowSource}</span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Data type: <br/> <b className={'redtext'}>{this.props.flowDatatype}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}><span>Destination: <br/> <b className={'redtext'}>{this.props.flowDestination}</b></span></div>
                        <div className="vl"></div>
                        <div className={'confflowelement'}>
                            <span>Time: <br/> From <b className={'redtext'}>{this.props.flow.hourFrom+':'+this.props.flow.minFrom}</b>
                                <br/> To <b className={'redtext'}>{this.props.flow.hourTill+':'+this.props.flow.minTill}</b></span>
                        </div>
                    </div>
                    {(this.props.flowDestination==='Internet' && this.props.appInternetAccess.url!=='') ?
                        <div className={'exceptionDiv'}>
                            App is trying to access : <b>{this.props.appInternetAccess.url}</b>
                        </div>
                        : null
                    }
                    {/*<div className={'buttonsdiv'}>*/}
                    {/*    <a href="/" className="editbutton" onClick={this.onEditPolicy}>Edit</a>*/}
                    {/*    <a href="/" className="removebutton" onClick={this.onRemovePolicy}>Remove</a>*/}
                    {/*</div>*/}
                </div>
            );
        }




    }
}

export default ConflictingAppFlow;