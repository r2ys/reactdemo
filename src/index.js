import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// class Square extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: null,
//         };
//     }
//
//     render() {
//         return (
//             <button className="square" onClick={() => this.props.onClick()} >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            console.log(step);
            console.log(move);
            console.log(desc);
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        console.log(moves);

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log(squares[a]);
            console.log(squares[b]);
            console.log(squares[c]);
            return squares[a];
        }
    }
    return null;
}

class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <tr>
                <td className="cell-content-id" onClick={() => this.props.onClick()} >
                    {this.props.value.id}
                </td>
                <td className="cell-content-name" >
                    {this.props.value.name}
                </td>
            </tr>
        );
    }
}

class TableView extends React.Component {

    renderCell() {
        let items = [];
        for(let i=0;i<this.props.dataArray.length;i++){
            items.push(<Cell value={this.props.dataArray[i]} onClick={() => this.props.onClick(i)} />);
        }
        return (
            <div>
                <tr>
                    <th>id</th>
                    <th>name</th>
                </tr>{items}
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="table-header">
                </div>
                <table className="table">
                    {this.renderCell()}
                    <br/>
                    <div>u can push up</div>
                </table>
                <div className="table-footer">
                </div>
            </div>
        );
    }
}

class Controller extends React.Component {

    constructor(props) {
        super(props);
        var source = [];
        for (var i = 0; i<200; i++) {
            var model = {
                id:i,
                name:"name" + i
            }
            source.push(model);
        }
        this.state = {
            datasource: source,
            selectedIndex: 0,
            sortFlag: true,
        };
    }

    handleClick(i) {
        const model = this.state.datasource[i];
        alert(i + ":" + model.id + "---" + model.name);
    }

    sort() {
        let sortedList = this.state.datasource.slice();
        const sortFlag = !this.state.sortFlag;
        console.log(sortFlag);

        sortedList.sort(function(a,b){
            return sortFlag ? a.id - b.id : b.id - a.id;
        });
        this.setState({datasource:sortedList, sortFlag:sortFlag});
    }

    render() {
        const datasource = this.state.datasource;

        return (
            <div className="controller">
                <button onClick={() => this.sort()}>
                    排序
                </button>
                <div className="tableview">
                    <TableView
                        dataArray={datasource}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="tableview-footer">
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

ReactDOM.render(
    <Controller/>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
