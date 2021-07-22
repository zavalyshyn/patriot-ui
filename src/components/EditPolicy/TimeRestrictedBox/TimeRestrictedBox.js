import React from 'react';
import './TimeRestrictedBox.css';
import SelectedTimeBox from "../SelectedTimeBox/SelectedTimeBox";

class TimeRestrictedBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromTime: null,
            tillTime: null
        };
        this.fromTimeSelected = this.fromTimeSelected.bind(this);
        this.tillTimeSelected = this.tillTimeSelected.bind(this);
    }

    fromTimeSelected(value) {
        this.setState({
            fromTime: value
        })
    }

    tillTimeSelected(value) {
        this.setState({
            tillTime: value
        })
    }

    render() {
        if (this.props.hidden) return null;

        function generateTimestamps() {
            let timestamps = [];
            for (let i=0; i<48; i++) {
                let time = (i*0.5) > 9.5 ? i*0.5 : `0${i*0.5}`;
                let hour24 = (time % 1 === 0) ? time : time.toString().split('.')[0];
                let hour12 = (parseInt(hour24) % 12 === 0) ? 12 : parseInt(hour24) % 12;
                let pmam = (parseInt(hour24) === 0) ? 'AM' : (parseInt(hour24) > 11) ? 'PM' : 'AM';
                let minute = (time % 1 === 0) ? '00' : '30';
                // timestamps.push(`${hour}:${minute}`);
                timestamps.push(`${hour12}:${minute} ${pmam}`);
            }
            return timestamps;
        }

        const timestamps = generateTimestamps();

        return(
            <div className="timeSelection">
                <div className="timeSelectBox">
                    <div id="timeText">From</div>
                    <div id="timeSelect">
                        <SelectedTimeBox options={timestamps} hidden={false}
                                         placeholder={this.props.timeFrom==='any' ? 'Any' : this.props.timeFrom}
                                         onSelected={this.props.fromTimeSelected}/>
                    </div>
                </div>
                <div className="timeSelectBox">
                    <div id="timeText">Till</div>
                    <div id="timeSelect">
                        <SelectedTimeBox options={timestamps} hidden={false}
                                         placeholder={this.props.timeTill==='any' ? 'Any' : this.props.timeTill}
                                         onSelected={this.props.tillTimeSelected}/>
                    </div>
                </div>
                <a href="/" id="buttonlink" onClick={this.props.onCancelClicked}>
                    <div id="cancelbuttontext">
                        Remove restriction by time
                    </div>
                    <img id="buttonimage" src="/images/icons/icon_cross_red.svg" alt={"Cancel time restriction"}/>
                </a>
            </div>
        )
    }
}

export default TimeRestrictedBox;