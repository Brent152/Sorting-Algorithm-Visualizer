import React, { Component } from 'react';
import './Visualizer.css';
// I need to make the size of the array bars be based on the size of the screen
const MAX_ARRAY_ELEMENT_NUMBER = 400;
const UNSORTED_COLOR = "rgb(219, 25, 25)", SORTING_COLOR = "rgb(52, 24, 211)",
        SORTED_COLOR = "rgb(31, 212, 31)", CHECK_COLOR = "fuchsia", WALL_COLOR = "black",
        EXTRA_COMPARISON_COLOR = "gray";
const PAUSE_MULTIPLIER = 20;

// Global but changed by user (or caused by a user change)
let ARRAY_SIZE = 150;
let ANIMATION_SPEED = 20;
let FAST_MODE = false;

let MARGIN_LEFT, BAR_WIDTH;


class Visualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: [],
            frames: [],
            isAnimating: false
        };
        
    }

    render() { 

        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="form-group mx-auto">
                        <label htmlFor="arraySizeRange" className="form-label">Random Array Size</label>
                        <input type="range" className="form-range" min="1" max="500" defaultValue="150" step="1" id="arraySizeRange"
                            onChange={this.arraySizeChangeHandle} disabled={this.state.isAnimating}></input>
                    </div>
                    <div className="mx-auto">
                        <button className="btn btn-dark mx-1" onClick={this.selectionSortHandle} disabled={this.state.isAnimating}>Selection Sort</button>
                        <button className="btn btn-dark mx-1" onClick={this.bubbleSortHandle} disabled={this.state.isAnimating}>Bubble Sort</button>
                        <button className="btn btn-dark mx-1" onClick={this.insertionSortHandle} disabled={this.state.isAnimating}>Insertion Sort</button>
                        <button className="btn btn-dark mx-1" onClick={this.heapSortHandle} disabled={this.state.isAnimating}>Heap Sort</button>
                        <button className="btn btn-dark mx-1" onClick={this.mergeSortHandle} disabled={this.state.isAnimating}>Merge Sort</button>
                        <button className="btn btn-dark mx-1" onClick={this.quickSortHandle} disabled={this.state.isAnimating}>Quick Sort</button>
                        <button className="btn btn-dark mx-1" onClick={this.quickSortHandle} disabled={this.state.isAnimating}>Block Sort</button>
                    </div>
                </nav>

                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="navbar navbar-expand-lg navbar-light mx-auto">
                        <div className="form-group col-md-6">
                            <label htmlFor="EnterCustomArrayLabel">Enter Custom Array</label>
                            <input type="email" className="form-control" id="EnterCustomArrayField" placeholder="Eg. 55, 26, 31..." style={{}}></input>
                        </div>
                        <button className="btn btn-dark col-md-4 mx-auto" onClick={this.generateArrayHandle} disabled={this.state.isAnimating} style={{}}>Enter Array</button>
                    </div>

                    <div className="mx-auto row">
                        <div className="form-group mx-auto col-sm-6">
                            <label htmlFor="speedRange" className="form-label">Speed</label>
                            <input type="range" className="form-range" min="1" max="500" defaultValue="480" step="1" id="speedRange"
                                onChange={this.speedChangeHandle} disabled={this.state.isAnimating}></input>
                        </div>

                        <div className="form-check mx-auto col-sm-6">
                            <input className="form-check-input mx-auto" type="checkbox" value="" id="ultraFastCheck" onChange={this.ultraFastChangeHandle} disabled={this.state.isAnimating}></input>
                            <label className="form-check-label mx-auto" htmlFor="ultraFastCheck">Ultra-fast Mode</label>
                        </div>
                    </div>
                </nav>


                <div className="array-container"
                style={{
                    right:"20%",
                    left: "1%"

                }}>
                    {this.state.array.map((bar, index) => (
                        <div
                        className="array-bar"
                        key={index}
                        style={
                            {height: `${bar.value}px`, 
                            backgroundColor: bar.color,
                            marginLeft: `${MARGIN_LEFT}%`,
                            width: `${BAR_WIDTH}%`,
                        }}></div>
                    ))}
                </div>

                <div className="rectangle">
                </div>

            </React.Fragment>
        );
    }

    // Set default state
    componentDidMount() {
        MARGIN_LEFT = 10.0/ARRAY_SIZE;
        BAR_WIDTH = (100-5-(MARGIN_LEFT*ARRAY_SIZE))/ARRAY_SIZE;
        FAST_MODE = document.getElementById("ultraFastCheck").value;
        this.setState({array: this.newArray()});
        this.setState({frames: []});
    }

    speedChangeHandle = () => {
        ANIMATION_SPEED = 500-document.getElementById("speedRange").value;
    }

    arraySizeChangeHandle = () => {
        ARRAY_SIZE = document.getElementById("arraySizeRange").value;
        MARGIN_LEFT = 5/ARRAY_SIZE;
        BAR_WIDTH = (100-5-(MARGIN_LEFT*ARRAY_SIZE))/ARRAY_SIZE;
        this.setState({array: this.newArray()});
    }

    ultraFastChangeHandle = () => {
        FAST_MODE = !FAST_MODE;
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
                this.saveFrames(arr, 1, false);
                arr[curIndex].color = UNSORTED_COLOR;
                if (arr[curIndex].value <= arr[minIndex].value) {
                    minIndex = curIndex;
                }
            }
            // Set sorting colors and save frame a lot of times so it has a pause
            arr[minIndex].color = SORTING_COLOR;
            arr[startIndex].color = SORTING_COLOR;
            this.saveFrames(arr, PAUSE_MULTIPLIER, false);

            // Swap values
            temp = arr[minIndex].value;
            arr[minIndex].value = arr[startIndex].value;
            arr[startIndex].value = temp;

            // Set sorting colors and save frame
            arr[minIndex].color = UNSORTED_COLOR;
            arr[startIndex].color = SORTED_COLOR;
            this.saveFrames(arr, 1, true);
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
                this.saveFrames(arr, 1, false);
                if (arr[j+1].value < arr[j].value) {
                    // Swap the values
                    temp = arr[j].value;
                    arr[j].value = arr[j+1].value;
                    arr[j+1].value = temp;
                    this.saveFrames(arr, 1, false);
                }
                // Set tested colors back to red
                arr[j].color = UNSORTED_COLOR;
                arr[j+1].color = UNSORTED_COLOR;
            }
            // Last piece will be in place, turn it green
            arr[ARRAY_SIZE-i-1].color = SORTED_COLOR;
            this.saveFrames(arr, 1, true);
        }
        arr[0].color = SORTED_COLOR;
        this.saveFrames(arr, 1, true);
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
                this.saveFrames(arr, 1, false);
            }
            
            let curIndex = sortingIndex-1;
            while (curIndex >= 0 && arr[curIndex].value > temp) {
                arr[curIndex+1].color = CHECK_COLOR;
                this.saveFrames(arr, 1, false);
                arr[curIndex+1].value = arr[curIndex].value;
                arr[curIndex+1].color = SORTED_COLOR;
                curIndex--;
            }
            arr[curIndex+1].value = temp;

            // Set sorting color and pause
            arr[curIndex+1].color = SORTING_COLOR;
            this.saveFrames(arr, PAUSE_MULTIPLIER/1, false);
            arr[curIndex+1].color = SORTED_COLOR;

            this.saveFrames(arr, 1, true);
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
        this.saveFrames(arr, 1, false);
        
        // Pick the middle index as the pivot, this is slower than doing something like
        // the middle-of-3 method, but for visualization I think the middle index makes
        // the most sense 
        let pivotValue = arr[Math.floor(lowIndex + (highIndex - lowIndex)/2)].value;
        let pivotIndex = Math.floor(lowIndex + (highIndex - lowIndex)/2);
        let incrementedI, decrementedJ;
        arr[pivotIndex].color = EXTRA_COMPARISON_COLOR;

        let i = lowIndex, j = highIndex, temp;

        if (lowIndex >= highIndex) {
            // All stuff in these bounds must be sorted
            arr[lowIndex].color = SORTED_COLOR;
            arr[highIndex].color = SORTED_COLOR;
            arr[pivotIndex].color = SORTED_COLOR;
            this.saveFrames(arr, 1, true);
            return;
        }

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
                this.saveFrames(arr, 1, false);
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
            this.saveFrames(arr, 1, false);
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
            this.saveFrames(arr, 1, false);
            this.quickSort(arr, lowIndex, j);
        }
        
        if (highIndex > i) {
            // Some indicies are assumed sorted? Make all them the right color lol
            for (let w = lowIndex; w < i; w++) {
                arr[w].color = SORTED_COLOR;
            }
            arr[lowIndex].color = SORTED_COLOR;
            this.saveFrames(arr, 1, false);
            this.quickSort(arr, i, highIndex);
        }
        // All stuff in these bounds must be sorted
        arr[lowIndex].color = SORTED_COLOR;
        arr[highIndex].color = SORTED_COLOR;
        arr[pivotIndex].color = SORTED_COLOR;
        this.saveFrames(arr, 1, true);
    }
    // End of Quick sort

    // Merge Sort the array - called by Merge Sort Button
    mergeSortHandle = () => {
        this.state.frames = [];
        console.log("Start Merge Sort");
        // Brand new array copied from this.state.array
        const arr = [];
        for (const element of this.state.array) {
            arr.push(element);
        }

        this.mergeSort(arr, 0, ARRAY_SIZE-1);
        for (let i = 0; i < ARRAY_SIZE; i++) {
            arr[i].color = SORTED_COLOR;
        }
        this.saveFrames(arr, 1, true);
        this.animate();
    }

    mergeSort = (arr, lowIndex, highIndex) => {
        // If array is not one element
        if (lowIndex < highIndex) {
            let middleIndex = lowIndex + Math.floor((highIndex - lowIndex)/2);
            // Mergesort the two halves
            this.mergeSort(arr, lowIndex, middleIndex);
            this.mergeSort(arr, middleIndex+1, highIndex);
            this.merge(arr, lowIndex, middleIndex, highIndex);
        }
    }

    merge = (arr, lowIndex, middleIndex, highIndex) => {
        // THE TWO BLUE BARS ARE THE INDICIES OF THE VALUES THAT ARE BEING COMPARED,
        // BUT THE VALUES ARE IN THE AUXILLARY ARRAYS SO THOSE VALUES AREN'T SHOWN 
        // BLACK BARS ARE THE EDGES OF THE AUXILLARY ARRAYS, INCLUSIVE
        
        let array1Size = middleIndex - lowIndex + 1;
        let array2Size = highIndex - middleIndex;

        let Array1 = new Array(array1Size);
        let Array2 = new Array(array2Size);

        // Copy data to smaller arrays
        for (let i = 0; i < array1Size; i++) {
            Array1[i] = arr[lowIndex+i].value;
        }
        for (let j = 0; j < array2Size; j++) {
            Array2[j] = arr[middleIndex+1+j].value;
        }

        let i = 0, j = 0, k = lowIndex;
        arr[lowIndex].color = WALL_COLOR;
        arr[lowIndex+array1Size].color = WALL_COLOR;
        while (i < array1Size && j < array2Size) {
            if (Array1[i] <= Array2[j]) {
                // wall colors
                arr[lowIndex].color = WALL_COLOR;
                arr[lowIndex+array1Size-1].color = WALL_COLOR;
                arr[middleIndex+1].color = WALL_COLOR;
                arr[middleIndex+array2Size].color = WALL_COLOR;
                // sorting colors
                arr[lowIndex+i].color = SORTING_COLOR;
                arr[middleIndex+1+j].color = SORTING_COLOR;

                this.saveFrames(arr, 1, false);
                arr[lowIndex+i].color = UNSORTED_COLOR;
                arr[middleIndex+1+j].color = UNSORTED_COLOR;
                arr[k].value = Array1[i];
                i++;
            } else {
                // wall colors
                arr[lowIndex].color = WALL_COLOR;
                arr[lowIndex+array1Size-1].color = WALL_COLOR;
                arr[middleIndex+1].color = WALL_COLOR;
                arr[middleIndex+array2Size].color = WALL_COLOR;
                // sorting colors
                arr[lowIndex+i].color = SORTING_COLOR;
                arr[middleIndex+1+j].color = SORTING_COLOR;

                this.saveFrames(arr, 1, false);
                arr[lowIndex+i].color = UNSORTED_COLOR;
                arr[middleIndex+1+j].color = UNSORTED_COLOR;
                arr[k].value = Array2[j];
                j++;
            }
            k++;
        }
        // wall colors back
        arr[lowIndex].color = UNSORTED_COLOR;
        arr[lowIndex+array1Size-1].color = UNSORTED_COLOR;
        arr[middleIndex+1].color = UNSORTED_COLOR;
        arr[middleIndex+array2Size].color = UNSORTED_COLOR;
        // Copy the elements of L
        while (i < array1Size) {
            arr[k].value = Array1[i];
            i++;
            k++;
        }

        // Copy the elements of R
        while (j < array2Size) {
            arr[k].value = Array2[j];
            j++;
            k++;
        }
        if (lowIndex === 0 && middleIndex+array2Size+1 === ARRAY_SIZE) {
            for (let i = 0; i < ARRAY_SIZE; i++) {
                arr[i].color = SORTED_COLOR;
            }
        }
        this.saveFrames(arr, 1, true);
    }
    // End of Merge Sort

    // Heap Sort the array - called by Heap Sort Button
    heapSortHandle = () => {
        // The gray is the root of the current heap comparisons, the
        // pink are it's childs, it takes the largest of the three of
        // and puts it at the root index

        this.state.frames = [];
        console.log("Start Heap Sort");
        // Brand new array copied from this.state.array
        const arr = [];
        for (const element of this.state.array) {
            arr.push(element);
        }

        // Build the array into a heap
        for (let i = Math.floor(ARRAY_SIZE/2) - 1; i >= 0; i--) {
            this.maxHeapify(arr, ARRAY_SIZE, i);
        }

        let tempValue;
        // Extract elements from heap
        for (let i = ARRAY_SIZE-1; i > 0; i--) {
            tempValue = arr[0].value;
            arr[0].value = arr[i].value;
            arr[i].value = tempValue;
            arr[i].color = SORTED_COLOR;

            this.saveFrames(arr, 1, true);

            // maxHeapify the reduced heap
            this.maxHeapify(arr, i, 0);
        }
        // Don't need to maxHeapify when one element is left but do need to turn it to SORTED_COLOR
        arr[0].color = SORTED_COLOR;
        this.saveFrames(arr, 1, true);

        this.animate();
    }

    maxHeapify(arr, heapSize, rootIndex) {
        let tempValue;
        let largestIndex = rootIndex;
        // Left child
        let leftIndex = 2*rootIndex + 1;
        // Right child
        let rightIndex = 2*rootIndex + 2;

        if (leftIndex < heapSize) {
            arr[leftIndex].color = CHECK_COLOR;
            arr[largestIndex].color = EXTRA_COMPARISON_COLOR;
        }
        if (rightIndex < heapSize) {
            arr[rightIndex].color = CHECK_COLOR;
            arr[largestIndex].color = EXTRA_COMPARISON_COLOR;
        }
        this.saveFrames(arr, 1, false);
        if (leftIndex < heapSize) {
            arr[leftIndex].color = UNSORTED_COLOR;
            arr[largestIndex].color = UNSORTED_COLOR;
        }
        if (rightIndex < heapSize) {
            arr[rightIndex].color = UNSORTED_COLOR;
            arr[largestIndex].color = UNSORTED_COLOR;
        }

        // Find if a child a larger than the root (if both are take largest one)
        if (leftIndex < heapSize && arr[leftIndex].value > arr[largestIndex].value) {
            largestIndex = leftIndex;
        }
        if (rightIndex < heapSize && arr[rightIndex].value > arr[largestIndex].value) {
            largestIndex = rightIndex;
        }

        if (largestIndex !== rootIndex) {
            tempValue = arr[rootIndex].value;
            arr[rootIndex].value = arr[largestIndex].value;
            arr[largestIndex].value = tempValue;

            arr[rootIndex].color = SORTING_COLOR;
            arr[largestIndex].color = SORTING_COLOR;
            this.saveFrames(arr, 1, false);
            arr[rootIndex].color = UNSORTED_COLOR;
            arr[largestIndex].color = UNSORTED_COLOR;
            // Heapify whats left
            this.maxHeapify(arr, heapSize, largestIndex);
        }
    }

    // Loops through frames array slowly - called by sorting functions
    animate = () => {
        console.log("Sorted Array:");
        console.log(this.state.array);
        let i = 0;
        this.setState({array: this.state.frames[i]});
        this.setState({isAnimating: true});
        this.myInterval = setInterval(() => {
            this.setState({array: this.state.frames[i]});
            i++;
            if (this.state.frames[i] === undefined) {
                this.setState({isAnimating: false});
                clearInterval(this.myInterval);
            }
        }, ANIMATION_SPEED);
    }
    
    // Saves given array to this.state.frames
    saveFrames = (arr, numFrames, alwaysDisplay) => {
        if (!FAST_MODE || alwaysDisplay) {
            for (let i = 0; i < numFrames; i++) {
                const newArr = [];
                for (const element of arr) {
                // Make a copy of the object and then push it to the array
                newArr.push({...element})
                }
                this.state.frames.push(newArr);
            }
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export default Visualizer;