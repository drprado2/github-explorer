import React from 'react';
import Routes from "./routes";
import {BrowserRouter} from "react-router-dom";
import GlobalStyle from "./styles/global";

const App: React.FC = () => (
    <>
        <BrowserRouter basename={!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? '' : 'github-explorer'}>
            <Routes/>
        </BrowserRouter>
        <GlobalStyle/>
    </>
)

export default App;
