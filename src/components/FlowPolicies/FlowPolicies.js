import React from 'react';
import './FlowPolicies.css';
import FlowPolicy from './FlowPolicy/FlowPolicy'
import DefinePolicy from "../DefinePolicy/DefinePolicy";
import Button from "../Button/Button";
import EditPolicy from "../EditPolicy/EditPolicy";


class FlowPolicies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            policies: null,
            policiesHidden: false,
            definePolicyHidden: true,
            editPolicyHidden: true,
            currentPolicy: null
        };
        this.editPolicy = this.editPolicy.bind(this);
        this.removePolicy = this.removePolicy.bind(this);
        this.addPolicyClicked = this.addPolicyClicked.bind(this);
        this.newPolicyAdded = this.newPolicyAdded.bind(this);
        this.backFromDefinePolicy = this.backFromDefinePolicy.bind(this);
        this.saveNewEdittedPolicy = this.saveNewEdittedPolicy.bind(this);
        this.backFromEditPolicy = this.backFromEditPolicy.bind(this);
    }

    editPolicy(policy) {
        this.setState({
            currentPolicy: policy,
            policiesHidden: true,
            editPolicyHidden: false,
        })
        // console.log(JSON.stringify(policy, null, 2));
    }

    removePolicy(policyId) {
        // remove a specified policy
        fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'policies/'+this.props.userId+'/'+policyId, {
            method: 'DELETE'
        })
            .then( () => {
                // re-render policies list
                let currentPolicies = this.state.policies;
                let indexToDelete = null;
                currentPolicies.forEach((pol,index) => {
                    if (pol.id===policyId) indexToDelete=index;
                });
                if (indexToDelete!==null) {
                    currentPolicies.splice(indexToDelete,1);
                    this.setState({
                        policies: currentPolicies
                    });
                }
            })
    }

    addPolicyClicked(event) {
        event.preventDefault();
        this.setState({
            definePolicyHidden: false,
            policiesHidden: true
        });
    }

    newPolicyAdded(policy) {
        const currentPolicies = this.state.policies.slice();
        // console.log('Policy:',policy);
        currentPolicies.push(policy);
        this.setState({
            policies: currentPolicies,
            policiesHidden: false,
            definePolicyHidden: true,
        })
    }

    saveNewEdittedPolicy(editedPolicy) {
        // update displayed policies
        let currentPolicies = this.state.policies;
        let newPolicies = [];
        currentPolicies.forEach((policy) => {
            if (policy.id!==editedPolicy.id) newPolicies.push(policy);
            else newPolicies.push(editedPolicy)
        });
        this.setState({
            policies: newPolicies,
            currentPolicy: null,
            policiesHidden: false,
            editPolicyHidden: true,
        })
    }

    componentDidMount() {
        // console.log(process.env.REACT_APP_PATRIOT_USER_API_URL + 'policies');
        fetch(process.env.REACT_APP_PATRIOT_USER_API_URL+'policies/'+this.props.userId)
            .then(res => res.json())
            .then(policies => {
                this.setState({
                    policies: policies
                });
            })
    }

    backFromDefinePolicy(event) {
        event.preventDefault();
        this.setState({
            definePolicyHidden: true,
            policiesHidden: false
        })
    }

    backFromEditPolicy(event) {
        event.preventDefault();
        this.setState({
            editPolicyHidden: true,
            policiesHidden: false
        })
    }

    render() {

        if (!this.state.policiesHidden) {
            const policies = this.state.policies;

            if (policies) {
                const flows = this.state.policies.map((policy,index)=> {
                    // console.log("POLICY: ",policy);
                    return (
                        <FlowPolicy key={index} policy={policy} onEditPolicy={this.editPolicy} onRemovePolicy={this.removePolicy}/>
                    )
                });

                return(
                    <div>
                        <div className="header-wrap">
                            <a href="/" onClick={this.props.onBackClicked}>
                                <img id="backbutton" src="/images/icons/arrows/icon_arrow_left.svg" alt={"Back button"}/>
                            </a>
                            <a href="/" onClick={this.props.onHomeClicked}>
                                <img id="logo" src="/images/patrIoT_logo.svg" alt={"PatrIoT logo"}/>
                            </a>
                        </div>

                        <div className="description"> Privacy policies
                            <p className={"description-clarification"}>These data flows should <label className={'timeWarning'}><u>never</u></label> occur</p>
                        </div>

                        {flows}

                        <Button text={"Add new privacy policy"} onClick={this.addPolicyClicked}/>

                    </div>
                )
            }
            else {
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

        if (!this.state.definePolicyHidden) {
            return (
                <DefinePolicy onSavePolicy={this.newPolicyAdded} onBackClicked={this.backFromDefinePolicy}
                              onHomeClicked={this.props.onHomeClicked} userId={this.props.userId}/>
            )
        }

        // {return this.state.editPolicyHidden ? null : <EditPolicy policy={this.state.currentPolicy}
        //          onSaveEdittedPolicy={this.saveNewEdittedPolicy}/>}

        if (!this.state.editPolicyHidden) {
            return (
                <EditPolicy policy={this.state.currentPolicy} onSaveEdittedPolicy={this.saveNewEdittedPolicy}
                            onBackClicked={this.backFromEditPolicy} onHomeClicked={this.props.onHomeClicked}
                            userId={this.props.userId}/>
            )
        }
    }
}

export default FlowPolicies;