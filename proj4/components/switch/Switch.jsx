import './Switch.css';
import React from 'react';
import States from '../states/States';
import Example from '../example/Example';

class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'example'
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick() {
        this.setState({
            view: this.state.view === 'example' ? 'state' : 'example'
        });
    }

    render() {
        let componentToDisplay = this.state.view === 'example' ? <Example/> : <States/>;
        return (
            <div>
                <button onClick={this.handleButtonClick}> {this.state.view === 'example' ? 'Switch to States' : 'Switch to Example'}</button>
                {componentToDisplay}
            </div>
        );
    }
}

export default Switch;