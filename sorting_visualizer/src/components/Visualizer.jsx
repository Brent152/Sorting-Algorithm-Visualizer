import React, { Component } from 'react';
import './Visualizer.css';
// I need to make the size of the array bars be based on the size of the screen
const ARRAY_SIZE = 300;
const ANIMATION_SPEED = 1;
const MAX_ARRAY_ELEMENT_NUMBER = 400;
const UNSORTED_COLOR = "rgb(219, 25, 25)", SORTING_COLOR = "rgb(52, 24, 211)",
        SORTED_COLOR = "rgb(31, 212, 31)", CHECK_COLOR = "fuchsia", WALL_COLOR = "black",
        PIVOT_COLOR = "gray";
const PAUSE_MULTIPLIER = 20;

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
    selectionSortHandle = () => {
        this.state.frames = [];
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
                // Every bar it checks turns magenta for a frame
                arr[curIndex].color = CHECK_COLOR;
                this.saveFrames(arr, 1);
                arr[curIndex].color = UNSORTED_COLOR;
                if (arr[curIndex].value <= arr[minIndex].value) {
                    minIndex = curIndex;
                }
            }
            // Set sorting colors and save frame a lot of times so it has a pause
            arr[minIndex].color = SORTING_COLOR;
            arr[startIndex].color = SORTING_COLOR;
            this.saveFrames(arr, PAUSE_MULTIPLIER);

            // Swap values
            temp = arr[minIndex].value;
            arr[minIndex].value = arr[startIndex].value;
            arr[startIndex].value = temp;

            // Set sorting colors and save frame
            arr[minIndex].color = UNSORTED_COLOR;
            arr[startIndex].color = SORTED_COLOR;
            this.saveFrames(arr, 1);
        }
        // Animate the frames array
        this.animate();
    }

    // Bubble sort the array - called by Bubble Sort Button
    bubbleSortHandle = () => {
        this.state.frames = [];
        console.log("Start Bubble Sort");

        // Brand new array copied from this.state.array
        const arr = [];
        for (const element of this.state.array) {
            arr.push(element);
        }
        // Bubble Sort
        let temp;
        for (let i = 0; i < ARRAY_SIZE-1; i++) {
            // Subtract i from array size because that partition is sorted
            for (let j = 0; j < ARRAY_SIZE-i-1; j++) {
                arr[j].color = SORTING_COLOR;
                arr[j+1].color = SORTING_COLOR;
                this.saveFrames(arr, 1);
                if (arr[j+1].value < arr[j].value) {
                    // Swap the values
                    temp = arr[j].value;
                    arr[j].value = arr[j+1].value;
                    arr[j+1].value = temp;
                    this.saveFrames(arr, 1);
                }
                // Set tested colors back to red
                arr[j].color = UNSORTED_COLOR;
                arr[j+1].color = UNSORTED_COLOR;
            }
            // Last piece will be in place, turn it green
            arr[ARRAY_SIZE-i-1].color = SORTED_COLOR;
        }
        arr[0].color = SORTED_COLOR;
        this.saveFrames(arr, 1);
        // Animate the frames array
        this.animate();
    }

    // Insertion sort the array - called by Insertion Sort Button
    insertionSortHandle = () => {
        this.state.frames = [];
        console.log("Start Insertion Sort");
        // Brand new array copied from this.state.array
        const arr = [];
        for (const element of this.state.array) {
            arr.push(element);
        }

        arr[0].color = SORTED_COLOR;

        for (let sortingIndex = 1; sortingIndex < ARRAY_SIZE; sortingIndex++) {
            
            let temp = arr[sortingIndex].value;
            arr[sortingIndex].color = SORTING_COLOR;
            // Set sorting color and pause
            for (let i = 0; i < PAUSE_MULTIPLIER/1.5; i++) {
                this.saveFrames(arr, 1);
            }
            
            let curIndex = sortingIndex-1;
            while (curIndex >= 0 && arr[curIndex].value > temp) {
                arr[curIndex+1].color = CHECK_COLOR;
                this.saveFrames(arr, 1);
                arr[curIndex+1].value = arr[curIndex].value;
                arr[curIndex+1].color = SORTED_COLOR;
                curIndex--;
            }
            arr[curIndex+1].value = temp;

            // Set sorting color and pause
            arr[curIndex+1].color = SORTING_COLOR;
            this.saveFrames(arr, PAUSE_MULTIPLIER/1.5);
            arr[curIndex+1].color = SORTED_COLOR;

            this.saveFrames(arr, 1);
        }
        // Animate the array
        this.animate();
    }

    // Quick Sort the array - called by Quick Sort Button
    quickSortHandle = () => {
        this.state.frames = [];
        console.log("Start Quick Sort");
        // Brand new array copied from this.state.array
        const arr = [];
        for (const element of this.state.array) {
            arr.push(element);
        }

        this.quickSort(arr, 0, ARRAY_SIZE-1);

        this.animate();
    }

    quickSort = (arr, lowIndex, highIndex) => {
        arr[lowIndex].color = WALL_COLOR;
        arr[highIndex].color = WALL_COLOR;
        this.saveFrames(arr, 1);

        if (lowIndex >= highIndex) {
            // All stuff in these bounds must be sorted
            arr[lowIndex].color = SORTED_COLOR;
            arr[highIndex].color = SORTED_COLOR;
            arr[pivotIndex].color = SORTED_COLOR;
            this.saveFrames(arr, 1);
            return;
        }
        
        // Pick the middle index as the pivot, this is slower than doing something like
        // the middle-of-3 method, but for visualization I think the middle index makes
        // the most sense 
        let pivotValue = arr[Math.floor(lowIndex + (highIndex - lowIndex)/2)].value;
        let pivotIndex = Math.floor(lowIndex + (highIndex - lowIndex)/2);
        let incrementedI, decrementedJ;
        arr[pivotIndex].color = PIVOT_COLOR;

        let i = lowIndex, j = highIndex, temp;

        while (i <= j) {
            // Had to combine two loops into one with if statements for animation purposes
            while (arr[i].value < pivotValue || arr[j].value > pivotValue) {
                // Increment i until it finds a value greater than pivot
                if (arr[i].value < pivotValue) {
                    arr[i].color = CHECK_COLOR;
                    i++;
                    incrementedI = true;
                } else {
                    arr[i].color = SORTING_COLOR;
                    incrementedI = false;
                }
                // Decrement j until it finds a value less than pivot
                if (arr[j].value > pivotValue) {
                    arr[j].color = CHECK_COLOR;
                    j--;
                    decrementedJ = true;
                } else {
                    arr[j].color = SORTING_COLOR;
                    decrementedJ = false;
                }
                this.saveFrames(arr, 1);
                // Change anything changed back to unsorted
                if (incrementedI) {
                    arr[i-1].color = UNSORTED_COLOR;
                } else {
                    arr[i].color = UNSORTED_COLOR;
                }
                if (decrementedJ) {
                    arr[j+1].color = UNSORTED_COLOR;
                } else {
                    arr[j].color = UNSORTED_COLOR;
                }
                arr[lowIndex].color = WALL_COLOR;
                arr[highIndex].color = WALL_COLOR;
            }
            arr[i].color = SORTING_COLOR;
            arr[j].color = SORTING_COLOR;
            this.saveFrames(arr, 1);
            // Change back to unsorted
            arr[i].color = UNSORTED_COLOR;
            arr[j].color = UNSORTED_COLOR;
            arr[lowIndex].color = WALL_COLOR;
            arr[highIndex].color = WALL_COLOR;

            if (i <= j) {
                // Swap values at i and j and show their colors
                temp = arr[i].value;
                arr[i].value = arr[j].value;
                arr[j].value = temp;
                i++;
                j--;
            }
        }
        if (lowIndex < j) {
            arr[highIndex].color = UNSORTED_COLOR;
            this.saveFrames(arr, 1);
            this.quickSort(arr, lowIndex, j);
        }
        
        if (highIndex > i) {
            // Some indicies are assumed sorted? Make all them the right color lol
            for (let w = lowIndex; w < i; w++) {
                arr[w].color = SORTED_COLOR;
            }
            arr[lowIndex].color = SORTED_COLOR;
            this.saveFrames(arr, 1);
            this.quickSort(arr, i, highIndex);
        }
        // All stuff in these bounds must be sorted
        arr[lowIndex].color = SORTED_COLOR;
        arr[highIndex].color = SORTED_COLOR;
        arr[pivotIndex].color = SORTED_COLOR;
        this.saveFrames(arr, 1);
    }
    // End of Quick sort

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
    saveFrames = (arr, numFrames) => {
        for (let i = 0; i < numFrames; i++) {
            const newArr = [];
            for (const element of arr) {
              // Make a copy of the object and then push it to the array
              newArr.push({...element})
            }
            this.state.frames.push(newArr);
        }
    }

    render() { 

        return (
            <React.Fragment>

                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <button className="btn btn-dark mx-auto" onClick={this.generateArrayHandle}>Generate New Array</button>
                        <div className="mx-auto">
                            <button className="btn btn-dark mx-1" onClick={this.selectionSortHandle}>Selection Sort</button>
                            <button className="btn btn-dark mx-1" onClick={this.bubbleSortHandle}>Bubble Sort</button>
                            <button className="btn btn-dark mx-1" onClick={this.insertionSortHandle}>Insertion Sort</button>
                            <button className="btn btn-dark mx-1" onClick={this.quickSortHandle}>Quick Sort</button>
                            <button className="btn btn-dark mx-1" onClick={this.quickSortHandle}>Merge Sort</button>
                            <button className="btn btn-dark mx-1" onClick={this.quickSortHandle}>Heap Sort</button>
                            <button className="btn btn-dark mx-1" onClick={this.quickSortHandle}>Block Sort</button>
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