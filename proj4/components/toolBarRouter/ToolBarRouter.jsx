import React from "react";
import './ToolBarRouter.css';
import { HashRouter, Route, Link } from "react-router-dom";
import States from "../states/States";
import Example from "../example/Example";

class ToolBarRouter extends React.Component{
    render() {
        return(
        <div>
            <HashRouter>
                <header>
                    <Link to="/states">States</Link>
                    <Link to="/example">Example</Link>
                </header>   
                <Route path="/states" component={States} />
                <Route path="/example" component={Example} />
            </HashRouter>
        </div>
        );
    }
}

export default ToolBarRouter;