import React, { Component } from "react";

import './InfiniteTable.css';

import request from "superagent";

// Import the library
import { Table } from "apache-arrow";

// ... Fetch the data from the body of API ...
//const tbl = Table.from(body)

class InfiniteTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //start: 100,
            //length: 200,
            done: false,
            error: false,
            loading: false,
            rows: [],
        };

        window.onscroll = () => {
            const {
                loadRows,
                state: {
                    done,
                    loading,
                },
            } = this;

            if (loading || done) return;

            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                loadRows();
            }
        };
    }

    componentWillMount() {
        this.loadRows();
    }

    loadRows = () => {
        this.setState({ loading: true }, () => {
            request
                //.get('http://0.0.0.0:8080/api/read?start=' + this.state.start + '&length=' + this.state.length)
                .get('https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=json&sole')
                .then((results) => {
                    this.setState({
                        done: this.state.rows.length >= 1000,
                        rows: this.state.rows.concat(results.body.results),
                        loading: false,
                    });
                })
                .catch((err) => {
                    this.setState({
                        error: err.message,
                        loading: false,
                    });
                })
        });
    }

    render() {
        let afterTable

        if (this.state.loading) {
            afterTable = 'Loading...'
        } else {
            afterTable = ''
        }

        return (
            <div className="InfiniteTable-container container">
                <h1>Welcome to Infinite Table!</h1>

                <table className="InfiniteTable-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Balance</th>
                        <th>Created</th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.state.rows.map(row => (
                        <tr key={row.email}>
                            <td>{row.first + ' ' + row.last}</td>
                            <td>{row.email}</td>
                            <td>{row.address}</td>
                            <td>{row.balance}</td>
                            <td>{row.created}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {afterTable}
            </div>
        );
    }
}

export default InfiniteTable;
