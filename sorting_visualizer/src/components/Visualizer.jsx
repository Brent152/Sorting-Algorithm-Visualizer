import React, { Component } from 'react';
import './Visualizer.css';
// I need to make the size of the array bars be based on the size of the screen
const ARRAY_SIZE = 100;
const ANIMATION_SPEED = 500;
const MAX_ARRAY_ELEMENT_NUMBER = 400;
const UNSORTED_COLOR = "rgb(219, 25, 25)", SORTING_COLOR = "rgb(52, 24, 211)", SORTED_COLOR = "rgb(31, 212, 31)";

class Visualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: [],
            frames: [],
        };
        
    }

    // Set default state
    componentDidMount() {
        this.setState({array: this.newArray()});
        this.setState({frames: []});
    }

    // Called by Generate New Array Button and sets the state to a new array
    generateArrayHandle = () => {
        this.setState({array: this.newArray()});
        this.setState({frames: []});
    }

    // Creates a new array and returns it
    newArray = () => {
        const arr = [];
        for (let i = 0; i < ARRAY_SIZE; i++) {
            let bar = {
                value: getRandomInt(5, MAX_ARRAY_ELEMENT_NUMBER),
                color: UNSORTED_COLOR,
            }
            arr.push(bar);
        }
        console.log("made new array");
        return arr;
    }

    // Selection sort the array - called by Selection Sort Button
    selectionSort = () => {
        let minIndex, temp;
        // Brand new array copied from this.state.array
        const arr = [];
        for (const element of this.state.array) {
            arr.push(element);
        }
        console.log("Start Selection Sort");

        // Selection sort
        for (let startIndex = 0; startIndex < ARRAY_SIZE; startIndex++) {
            minIndex = startIndex;
            for (let curIndex = startIndex; curIndex < ARRAY_SIZE; curIndex++) {
                if (arr[curIndex].value <= arr[minIndex].value) {
                    minIndex = curIndex;
                }
            }
            // Set sorting colors and save frame
            arr[minIndex].color = SORTING_COLOR;
            arr[startIndex].color = SORTING_COLOR;
            this.saveFrame(arr);

            // Swap values
            temp = arr[minIndex].value;
            arr[minIndex].value = arr[startIndex].value;
            arr[startIndex].value = temp;

            // Set sorting colors and save frame
            arr[minIndex].color = UNSORTED_COLOR;
            arr[startIndex].color = SORTED_COLOR;
            this.saveFrame(arr);
        }
        // Animate the frames array
        this.animate();
    }

    // Insertion sort the array - called by Insertion Sort Button
    insertionSort = () => {
        // Brand new array copied from this.state.array
        const arr = [];
        for (const element of this.state.array) {
            arr.push(element);
        }

        for (let sortingIndex = 1; sortingIndex < ARRAY_SIZE; sortingIndex++) {
            let temp = arr[sortingIndex].value;
            
            for (let curIndex = sortingIndex-1; curIndex >= 0; curIndex--) {
                if (arr[sortingIndex].value < arr[curIndex].value) {
                    arr[curIndex+1].value = arr[curIndex].value; 
                } else {
                    arr[curIndex].value = temp;
                    break;
                }
            }
            this.saveFrame(arr);

            this.animate();
        }
    }

    // Loops through frames array slowly - called by sorting functions
    animate = () => {
        let i = 0;
        this.myInterval = setInterval(() => {
            this.setState({array: this.state.frames[i]});
            i++;
            if (this.state.frames[i] === undefined) {
                clearInterval(this.myInterval);
            }
        }, ANIMATION_SPEED);
    }
    
    // Saves given array to this.state.frames
    saveFrame = (arr) => {
        const newArr = [];
        for (const element of arr) {
          // Make a copy of the object and then push it to the array
          newArr.push({...element})
        }
        this.state.frames.push(newArr);
    }

    render() { 

        return (
            <React.Fragment>

                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <button className="btn btn-dark mx-auto" onClick={this.generateArrayHandle}>Generate New Array</button>
                        <div className="mx-auto">
                            <button className="btn btn-dark mx-1" onClick={this.selectionSort}>Selection Sort</button>
                            <button className="btn btn-dark mx-1" onClick={this.insertionSort}>Insertion Sort</button>
                            <button className="btn btn-dark mx-1">Quick Sort</button>
                        </div>
                    </div>
                </nav>


                <div className="array-container">
                    {this.state.array.map((bar, index) => (
                        <div className="array-bar" key={index} style={{height: `${bar.value}px`, backgroundColor: bar.color}}></div>
                    ))}
                </div>

                <div className="rectangle">
                </div>

            </React.Fragment>
        );
    }
}

export default Visualizer;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}