import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/userAction';
import Main from './Navigation/Main';
import { CircularProgress } from '@material-ui/core';

class App extends Component {
    componentDidMount() {
        this.props.dispatch(fetchUser());
    }

    render() {
        const { isFetching } = this.props.user;

        if (isFetching) {
            return (
                <div className='app-loading'>
                    <CircularProgress>
                        <span>Loading...</span>
                    </CircularProgress>
                </div>
            );
        }

        return <Main />;
    }
}

const mapStateToProps = (state) => ({
    ...state,
});

export default connect(mapStateToProps)(App);
