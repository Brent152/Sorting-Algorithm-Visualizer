import React, { Component } from 'react';
import './Visualizer.css';
// I need to make the size of the array bars be based on the size of the screen
const MAX_ARRAY_ELEMENT_NUMBER = 500;
const UNSORTED_COLOR = "rgb(219, 25, 25)", SORTING_COLOR = "rgb(52, 24, 211)",
        SORTED_COLOR = "rgb(31, 212, 31)", CHECK_COLOR = "fuchsia", WALL_COLOR = "black",
        EXTRA_COMPARISON_COLOR = "gray";
const PAUSE_MULTIPLIER = 20;

// Global but changed by user (or caused by a user change)
let FAST_MODE = false;
let HAS_ANIMATED = false;
let FRAME_INDEX = 0;
let SHOW_VALUES = false;

let ARRAY_SIZE, ANIMATION_SPEED, BAR_WIDTH, MAX_ELEMENT_FOUND;


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
                    <div className="mx-auto">
                        <label htmlFor="arraySizeRange" className="form-label" style={{fontWeight: "bold"}}>Random Array Size</label>
                        <br />
                        <input type="range" className="form-range w-auto" min="2" max="470" defaultValue="100" step="1" id="arraySizeRange"
                            onChange={this.arraySizeChangeHandle} disabled={this.state.isAnimating} style={{}}></input>
                        <br />
                        <button className="btn btn-dark mt-3" onClick={this.generateArrayHandle} disabled={this.state.isAnimating}>Generate New Random Array</button>
                    </div>
                    <div className="w-auto mx-auto">
                        <label htmlFor="speedRange" className="form-label" style={{fontWeight: "bold"}}>Speed</label>
                        <br />
                        <input type="range" className="form-range w-auto" min="1" max="500" defaultValue="480" step="1" id="speedRange"
                            onChange={this.speedChangeHandle} disabled={this.state.isAnimating} style={{}}></input>
                        <br />
                        <div className="mt-2">
                            <input className="form-check-input mx-1" type="checkbox" value="" id="showValuesCheck" onChange={this.showValuesChangeHandle} disabled={this.state.isAnimating}></input>
                            <label className="form-check-label mx-1" htmlFor="showValuesCheck">Show Values</label>
                            <br />
                            <input className="form-check-input mx-1" type="checkbox" value="" id="extraFastCheck" onChange={this.extraFastChangeHandle} disabled={this.state.isAnimating}></input>
                            <label className="form-check-label mx-1" htmlFor="extraFastCheck">Extra-fast Mode</label>
                        </div>
                    </div>

                    <div className="form-group mx-auto mt-auto">
                        <div className="mx-auto">
                            <button className="btn btn-dark mx-1 mt-1" onClick={this.selectionSortHandle} disabled={this.state.isAnimating}>Selection Sort</button>
                            <button className="btn btn-dark mx-1 mt-1" onClick={this.bubbleSortHandle} disabled={this.state.isAnimating}>Bubble Sort</button>
                            <button className="btn btn-dark mx-1 mt-1" onClick={this.insertionSortHandle} disabled={this.state.isAnimating}>Insertion Sort</button>
                            <button className="btn btn-dark mx-1 mt-1" onClick={this.heapSortHandle} disabled={this.state.isAnimating}>Heap Sort</button>
                            <button className="btn btn-dark mx-1 mt-1" onClick={this.mergeSortHandle} disabled={this.state.isAnimating}>Merge Sort</button>
                            <button className="btn btn-dark mx-1 mt-1" onClick={this.quickSortHandle} disabled={this.state.isAnimating}>Quick Sort</button>
                            <button className="btn btn-dark mx-1 mt-1" onClick={this.quickSortHandle} disabled={this.state.isAnimating}>Radix Sort</button>
                        </div>
                        <div className="mx-auto">
                            <label htmlFor="EnterCustomArrayLabel" className="mt-1" style={{fontWeight: "bold"}}>Custom Array</label>
                            <input type="email" className="form-control my-2" id="EnterCustomArrayField" placeholder="Must have spaces between elements!" style={{}}></input>
                            <button className="btn btn-dark" onClick={this.customArrayHandle} disabled={this.state.isAnimating} style={{}}>Enter Array</button>
                        </div>
                    </div>
                </nav>


                <div className="arrayContainer" id="arrayContainer">
                    {this.state.array.map((bar, index) => (
                        <div
                        className="arrayBar border border-auto"
                        key={index}
                        style={{
                            height: `${100*bar.value/MAX_ELEMENT_FOUND}%`, 
                            backgroundColor: bar.color,
                            width: `${BAR_WIDTH}%`,
                        }}></div>
                    ))}
                </div>
                <div className="arrayContainer" id="valueContainer" style={{bottom: "0%", top:"90.5%", height:"0%"}}>
                    {this.state.array.map((bar, index) => (
                        <div
                        key={index}
                        style={{
                            display: "inline-block",
                            width: `${BAR_WIDTH}%`,
                        }}>{SHOW_VALUES && bar.value}</div>
                    ))}
                </div>
                <div className="sideRectangle p-3">
                    <label id="AlgorithmName" style={{fontWeight: "bold"}}>No Algorithm</label>
                    <br />
                    <label id="AlgorithmTime" style={{wordWrap: "break-word"}}>Time Complexity:</label>
                    <br />
                    <label id="AlgorithmSpace" style={{wordWrap: "break-word"}}>Space Complexity:</label>
                    <br />
                    <label id="AlgorithmDescription" className="mt-1" style={{wordWrap: "break-word"}}>No Description</label>


                    <label className="colorText" style={{bottom: "31%"}}>= Unsorted</label>
                    <div className="colorIndicator" style={{backgroundColor: UNSORTED_COLOR, top: "65%"}}></div>
                    <label className="colorText" style={{bottom: "26%"}}>= Comparing</label>
                    <div className="colorIndicator" style={{backgroundColor: CHECK_COLOR, top: "70%"}}></div>
                    <label className="colorText" style={{bottom: "21%"}}>= Sorting</label>
                    <div className="colorIndicator" style={{backgroundColor: SORTING_COLOR, top: "75%"}}></div>
                    <label className="colorText" style={{bottom: "16%"}}>= Sorted</label>
                    <div className="colorIndicator" style={{backgroundColor: SORTED_COLOR, top: "80%"}}></div>
                    <label className="colorText" style={{bottom: "11%"}}>= Wall</label>
                    <div className="colorIndicator" style={{backgroundColor: WALL_COLOR, top: "85%"}}></div>
                    <label className="colorText" style={{bottom: "6%"}}>= Root/Pivot</label>
                    <div className="colorIndicator" style={{backgroundColor: EXTRA_COMPARISON_COLOR, top: "90%"}}></div>

                    <label id="AlgorithmName" style={{position: "absolute", fontWeight: "bold", left: "50%", bottom: "25%"}}>Manual Frame<br />Movement</label>
                    <button className="btn btn-dark mx-1 mt-1" onClick={this.frameLeft} disabled={this.state.isAnimating} style={{
                        position: "absolute",
                        bottom: "12%",
                        right: "33%",
                        width: "15%"
                    }}>←</button>
                    <button className="btn btn-dark mx-1 mt-1" onClick={this.frameRight} disabled={this.state.isAnimating} style={{
                        position: "absolute",
                        bottom: "12%",
                        right: "13%",
                        width: "15%"
                    }}>→</button>
                </div>
                <div className="bottomRectangle"></div>

            </React.Fragment>
        );
    }

    // Set default state
    componentDidMount() {
        ARRAY_SIZE = document.getElementById("arraySizeRange").value;
        BAR_WIDTH = (100)/ARRAY_SIZE;
        ANIMATION_SPEED = 500-document.getElementById("speedRange").value;
        FAST_MODE = document.getElementById("extraFastCheck").value;
        this.setState({array: this.newArray()});
        this.setState({frames: []});
    }

    // Called by Generate New Array Button and sets the state to a new array
    generateArrayHandle = () => {
        this.setState({array: this.newArray()});
        this.setState({frames: []});
    }

    speedChangeHandle = () => {
        ANIMATION_SPEED = 500-document.getElementById("speedRange").value;
    }

    showValuesChangeHandle = () => {
        SHOW_VALUES = !SHOW_VALUES;
        this.setState({});
    }

    arraySizeChangeHandle = () => {
        ARRAY_SIZE = document.getElementById("arraySizeRange").value;
        BAR_WIDTH = (100)/ARRAY_SIZE;
        this.setState({array: this.newArray()});
    }

    extraFastChangeHandle = () => {
        FAST_MODE = !FAST_MODE;
    }

    showValuesChange = () => {
        document.getElementById()
    }

    customArrayHandle = () => {
        // Get input
        let input = document.getElementById("EnterCustomArrayField").value;
        input = input.replace(/[^0-9 ]/g, "");
        // Parse into an array of integers
        const inputArray = input.split(" ");
        // Parse into an array of bar objects
        const arr = [];
        for (let i = 0; i < inputArray.length; i++) {
            if (inputArray[i] != "") {
                let bar = {
                    value: Number(inputArray[i]),
                    color: UNSORTED_COLOR,
                }
                arr.push(bar);
            }
        }
        if (arr.length < 2) {
            alert("Must contain 2 or more elements");
            return;
        }
        // Change "constants"
        ARRAY_SIZE = arr.length;
        BAR_WIDTH = (100)/ARRAY_SIZE;
        console.log(ARRAY_SIZE);
        console.log("Made new custom array");
        console.log(arr);
        this.setState({array: arr});
        // Find largest element
        MAX_ELEMENT_FOUND = arr[0].value;
        for (let i = 0; i < ARRAY_SIZE; i++) {
            if (arr[i].value > MAX_ELEMENT_FOUND) {
                MAX_ELEMENT_FOUND = arr[i].value;
            }
        }
    }

    frameLeft = () => {
        if (HAS_ANIMATED) {
            if (FRAME_INDEX > 0) {
                FRAME_INDEX--;
                this.setState({array: this.state.frames[FRAME_INDEX]});
            } else {
                FRAME_INDEX = this.state.frames.length-1;
                this.setState({array: this.state.frames[FRAME_INDEX]});
            }
        }
    }

    frameRight = () => {
        if (HAS_ANIMATED) {
            if (FRAME_INDEX < this.state.frames.length-1) {
                FRAME_INDEX++;
                this.setState({array: this.state.frames[FRAME_INDEX]});
            } else {
                FRAME_INDEX = 0;
                this.setState({array: this.state.frames[FRAME_INDEX]});
            }
        }
    }

    // Creates a new array and returns it
    newArray = () => {
        const arr = [];
        for (let i = 0; i < ARRAY_SIZE; i++) {
            let bar = {
                value: this.getRandomInt(5, MAX_ARRAY_ELEMENT_NUMBER),
                color: UNSORTED_COLOR,
            }
            arr.push(bar);
        }
        // Find largest element
        MAX_ELEMENT_FOUND = arr[0].value;
        for (let i = 0; i < ARRAY_SIZE; i++) {
            if (arr[i].value > MAX_ELEMENT_FOUND) {
                MAX_ELEMENT_FOUND = arr[i].value;
            }
        }
        console.log("Made new array");
        return arr;
    }

    // Selection sort the array - called by Selection Sort Button
    selectionSortHandle = () => {

        // Change Info
        document.getElementById("AlgorithmName").innerHTML = "Selection Sort";
        document.getElementById("AlgorithmTime").innerHTML ="Time Complexity: Θ(n^2)";
        document.getElementById("AlgorithmSpace").innerHTML ="Space Complexity: O(1)";
        document.getElementById("AlgorithmDescription").innerHTML = "Loops through unsorted elements to find the minimum, swaps the minimum with the next unsorted element.";
        document.getElementById("AlgorithmDescription").style.fontSize ="100%";

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
            this.saveFrames(arr, Math.floor(PAUSE_MULTIPLIER), false);

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

        // Change Info
        document.getElementById("AlgorithmName").innerHTML = "Bubble Sort";
        document.getElementById("AlgorithmTime").innerHTML ="Time Complexity: Θ(n^2)";
        document.getElementById("AlgorithmSpace").innerHTML ="Space Complexity: O(1)";
        document.getElementById("AlgorithmDescription").innerHTML = "Loops through unsorted elements swapping neighbors if left < right n-1 times.";
        document.getElementById("AlgorithmDescription").style.fontSize ="100%";

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

        document.getElementById("AlgorithmName").innerHTML = "Insertion Sort";
        document.getElementById("AlgorithmTime").innerHTML ="Time Complexity: Θ(n^2)";
        document.getElementById("AlgorithmSpace").innerHTML ="Space Complexity: O(1)";
        document.getElementById("AlgorithmDescription").innerHTML = "Loops through sorted elements shifting each to the right if the next unsorted element is lesser, inserts next element.";
        document.getElementById("AlgorithmDescription").style.fontSize ="100%";
        
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
            this.saveFrames(arr, Math.floor(PAUSE_MULTIPLIER), false);
            arr[curIndex+1].color = SORTED_COLOR;

            this.saveFrames(arr, 1, true);
        }
        // Animate the array
        this.animate();
    }

    // Quick Sort the array - called by Quick Sort Button
    quickSortHandle = () => {

        document.getElementById("AlgorithmName").innerHTML = "Quick Sort";
        document.getElementById("AlgorithmTime").innerHTML ="Time Complexity: Θ(nlog(n))";
        document.getElementById("AlgorithmSpace").innerHTML ="Space Complexity: O(log(n))";
        document.getElementById("AlgorithmDescription").innerHTML = "Picks a pivot, finds pairs of elements greater and lesser than the pivot on corresponding sides, swaps them, inserts the pivot, then recursively calls itself on both sides of the pivot.";
        document.getElementById("AlgorithmDescription").style.fontSize ="85%";

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

        // Change Info
        document.getElementById("AlgorithmName").innerHTML = "Merge Sort";
        document.getElementById("AlgorithmTime").innerHTML ="Time Complexity: Θ(nlog(n))";
        document.getElementById("AlgorithmSpace").innerHTML ="Space Complexity: O(n)";
        document.getElementById("AlgorithmDescription").innerHTML = "Recursively halves the array until there is one element in each, creates a duplicate of both halves, then loops through the halves adding the lesser element to the original array.";
        document.getElementById("AlgorithmDescription").style.fontSize ="85%";

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

        // Change Info
        document.getElementById("AlgorithmName").innerHTML = "Heap Sort";
        document.getElementById("AlgorithmTime").innerHTML ="Time Complexity: Θ(nlog(n))";
        document.getElementById("AlgorithmSpace").innerHTML ="Space Complexity: O(1)";
        document.getElementById("AlgorithmDescription").innerHTML = "Turns the array into a max heap, then places the root at the end of the unsorted portion of the array and maxHeapifys n-1 times.";
        document.getElementById("AlgorithmDescription").style.fontSize ="100%";

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
        FRAME_INDEX = 0;
        this.printArray(this.state.array);

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
        HAS_ANIMATED = true;
    }

    printArray = (arr) => {
        console.log("Sorted Array:");
        let output = "["
        for (let i = 0; i < ARRAY_SIZE-1; i++) {
            output += String(arr[i].value) + ", ";
        }
        output += String(arr[ARRAY_SIZE-1].value) + "]";
        console.log(output);
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

    getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
}

export default Visualizer;