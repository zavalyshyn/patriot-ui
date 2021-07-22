import React from 'react';
import SelectTimeBox from "../DefinePolicy/SelectTimeBox/SelectTimeBox";

class AppTimeConfig extends React.Component {
    constructor(props) {
        super(props);
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

        function convertTimeToAMPM(time) {
            let pmam = '';
            let hour = Number(time.split(':')[0]);
            let min = time.split(':')[1];
            if ((hour>=12) && (hour<24)) pmam = 'PM';
            if ((hour<12) || (hour===0)) pmam = 'AM';
            return `${hour%12}:${min} ${pmam}`;
        }

        return (
            <div className="timeSelection">
                <div className="timeSelectBox">
                    <div id="timeText">From</div>
                    <div id="timeSelect">
                        <SelectTimeBox options={timestamps} hidden={false} placeholder={convertTimeToAMPM(this.props.starttime)} onSelected={this.props.fromTimeSelected}/>
                    </div>
                </div>
                <div className="timeSelectBox">
                    <div id="timeText">Till</div>
                    <div id="timeSelect">
                        <SelectTimeBox options={timestamps} hidden={false} placeholder={convertTimeToAMPM(this.props.endtime)} onSelected={this.props.tillTimeSelected}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default AppTimeConfig;