import React from "react";
import {
  Button,
  SafeAreaView,
  Text,
  TouchableHighlight,
  View
} from "react-native";

const newGameState = {
  squares: Array(9).fill(null), //create an array of length 9 with null in it
  xIsNext: true
};

export default class App extends React.Component {
  //must call constructor with props and set a state
  constructor(props) {
    super(props);
    this.state = newGameState;
  }

  whoseTurn() {
    return this.state.xIsNext ? "X" : "O";
  }

  onNewGame() {
    this.setState(newGameState);
  }

  onMove(i) {
    let newSquares = this.state.squares.slice(); //returns new array copy
    const turn = this.whoseTurn(); // figures out if it is X's turn or O's turn.

    //if we have the current square already filled, or if we are in a state of win, then return null
    if (this.state.squares[i] || winner(this.state.squares)) return null;

    newSquares[i] = turn; //set the value of the square to be the current player's turn mark, either X or O

    //call the setState function to update the updated Square matrix, and the turn switch
    this.setState({
      squares: newSquares,
      xIsNext: !this.state.xIsNext
    });
  }

  //every class has a render function, to render the component
  render() {
    //create a style for the background
    const style = {
      backgroundColor: "beige",
      flex: 1,
      alignItems: "center"
    };

    return (
      //we are going to return SafeAreaView just so that the tiles are not printed in unaccesible locations
      //use the board component we made, with the squares prop and onmove prop (function that executes the onMove(i))
      //use the status, that takes in turn, winner, onNewGameProp, all of which just call functions
      <SafeAreaView style={style}>
        <Board squares={this.state.squares} onMove={i => this.onMove(i)} />
        <Status
          turn={this.whoseTurn()}
          winner={winner(this.state.squares)}
          onNewGame={() => this.onNewGame()}
        />
      </SafeAreaView>
    );
  }
}

//create a functional component Board that takes in an object with parameters squares and onMove.
//create a centered view, with rows that start at different indices of the squares
//pass the squares, into the Row component and the onMove function as well.
const Board = ({ squares, onMove }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Row squares={squares} startIndex={0} onMove={onMove} />
      <Row squares={squares} startIndex={3} onMove={onMove} />
      <Row squares={squares} startIndex={6} onMove={onMove} />
    </View>
  );
};

//create a functional component Row, that takes in the squares, the startindex, and onmove
//create a row view, that has three Square components, that have the label of the startIndex, startIndex + 1, startIndex + 2
const Row = ({ squares, startIndex, onMove }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Square label={squares[startIndex]} onPress={() => onMove(startIndex)} />
      <Square
        label={squares[startIndex + 1]}
        onPress={() => onMove(startIndex + 1)}
      />
      <Square
        label={squares[startIndex + 2]}
        onPress={() => onMove(startIndex + 2)}
      />
    </View>
  );
};

//make the Square functional component that takes in the label and the onPress function
const Square = ({ label, onPress }) => {
  //make some basic styles for the Square, that we will use for the TouchableHighlight, Text
  const style = {
    width: 100,
    height: 100,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center"
  };

  const textStyle = {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold"
  };

  //send in the onPress function that we pass in
  return (
    <TouchableHighlight style={style} onPress={onPress}>
      <Text style={textStyle}>{label}</Text>
    </TouchableHighlight>
  );
};

//create a Status functional component that takes in a turn, winner and, onNewGame function
const Status = ({ turn, winner, onNewGame }) => {
  //make the text that shows the status
  const text =
    winner === null
      ? "Tie game :-/"
      : winner !== undefined
      ? winner + " wins!"
      : turn + "'s turn";

  //send a view with the text, and a button that starts the onNewGame function
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 36, textAlign: "center" }}>{text}</Text>
      <Button title="Start new game" onPress={onNewGame} />
    </View>
  );
};

const winner = squares => {
  //basically all the combinations that could result in a win of the game
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    //go through the squares
    const [a, b, c] = lines[i]; //get the first comb

    //check if all the same type
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.indexOf(null) === -1) return null; // tie game, this means that every square is filled up.
  return undefined;
};
