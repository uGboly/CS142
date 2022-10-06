import React from 'react';
import './States.css';
import Header from '../header/Header';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());

    this.state = {
      substr:''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.setState({substr:event.target.value});
  }

  render() {
    let states = window.cs142models.statesModel().filter(s => s.toLowerCase().indexOf(this.state.substr.toLowerCase()) !== -1);

    states = states.map(s => (<li key={s}>{s}</li>));
    return (
      <div>
        <Header/>
        <input type="text" onChange={this.handleInputChange} value={this.state.substr} />
        <ul>
          {states}
        </ul>
      </div>
    );
  }
}

export default States;
