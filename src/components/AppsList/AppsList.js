import React from 'react';
import './AppsList.css';
import AppBlock from "./AppBlock/AppBlock";
import PatrIoTApp from "../PatrIoTApp/PatrIoTApp";

class AppsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apps: null,
            currentApp: null,
            appsListHidden: false,
            appHidden: true
        };
        this.onAppSelected = this.onAppSelected.bind(this);
        this.backFromApp = this.backFromApp.bind(this);
        this.onVerifyApp = this.onVerifyApp.bind(this);
    }

    onAppSelected(app) {
        this.setState({
            currentApp: app,
            appsListHidden: true,
            appHidden: false
        })
        // this.props.onAppSelected(app);
    }

    onVerifyApp() {

    }

    backFromApp(event) {
        event.preventDefault();
        this.setState({
            currentApp: null,
            appsListHidden: false,
            appHidden: true
        })
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_PATRIOT_API_URL+'apps/shortlist')
            .then(res => res.json())
            .then(apps => {
                this.setState({
                    apps: apps
                });
                // console.log(JSON.stringify(apps, null, 2));
            })
    }

    render() {

        if (!this.state.appsListHidden) {
            const apps = this.state.apps;

            if (apps) {

                const appBlocks = apps.map((app,index)=> {
                    return (
                        <AppBlock key={index} app={app} onAppSelected={this.onAppSelected}/>
                    )
                });

                return (
                    <div>
                        <div className="header-wrap">
                            <a href="/" onClick={this.props.onBackClicked}>
                                <img id="backbutton" src="/images/icons/arrows/icon_arrow_left.svg" alt={"Back button"}/>
                            </a>
                            <a href="/" onClick={this.props.onHomeClicked}>
                                <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                            </a>
                        </div>

                        <div className="description"> Select an app you wish to install</div>

                        <div className="appblocks">
                            {appBlocks}
                        </div>
                    </div>
                )
            } else {
                return (

                    <div>
                        <div className="header-wrap">
                            <a href="/" onClick={this.props.onBackClicked}>
                                <img id="backbutton" src="/images/icons/arrows/icon_arrow_left.svg" alt={"Back button"}/>
                            </a>
                            <a href="/" onClick={this.props.onHomeClicked}>
                                <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                            </a>
                        </div>

                        <div className={'loading'}> Loading ...</div>
                        <img className={'loading'} src={'/images/loading.gif'} alt={'loading'}/>
                    </div>
                )
            }
        }

        if (!this.state.appHidden) {
            return (
                <PatrIoTApp onBackClicked={this.backFromApp} onCancelClicked={this.backFromApp}
                            app={this.state.currentApp} onAppVerify={this.onVerifyApp}
                            onHomeClicked={this.props.onHomeClicked} userId={this.props.userId}/>
            )
        }
    }
}

export default AppsList;


