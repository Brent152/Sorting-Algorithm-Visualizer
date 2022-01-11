import React, { Component } from 'react';
import './Visualizer.css';

const ARRAY_SIZE = 200;
const ANIMATION_SPEED = 5;

class Visualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: [],
            frames: [],
        };
        
    }

    componentDidMount() {
        this.setState({array: this.newArray()});
        this.setState({frames: []});
    }

    generateArrayHandle = () => {
        this.setState({array: this.newArray()});
        this.setState({frames: []});
    }

    newArray = () => {
        const arr = [];
        for (let i = 0; i < ARRAY_SIZE; i++) {
            arr.push(getRandomInt(5, 600));
        }
        console.log("made new array");
        return arr;
    }

    selectionSort = () => {
        let minIndex, temp;
        const arr = this.newArray();
        // tHIS doESNT MAke anY SENSE
        console.log(arr);
        console.log("startselect");

        const framesDupe = [];
        for (let startIndex = 0; startIndex < ARRAY_SIZE; startIndex++) {
            minIndex = startIndex;
            for (let curIndex = startIndex; curIndex < ARRAY_SIZE; curIndex++) {
                if (arr[curIndex] < arr[minIndex]) {
                    minIndex = curIndex;
                }
            }
            temp = arr[minIndex];
            arr[minIndex] = arr[startIndex];
            arr[startIndex] = temp;
            console.log(arr);
            framesDupe[startIndex] = arr.slice();
        }
        // ADDING ALL SORTED ARRAYS TO FRAME
        console.log("framedupe");
        console.log(framesDupe);
        
        this.setState({frames: framesDupe});

        console.log(this.state.array);
        this.animate();
    }

    animate = () => {
        console.log(this.state.frames);
        let i = 0;
        this.myInterval = setInterval(() => {
            this.setState({array: this.state.frames[i]});
            i++;
            if (i === ARRAY_SIZE) {
                clearInterval(this.myInterval);
            }
        }, ANIMATION_SPEED);
    }

    render() { 

        const {array} = this.state;

        return (
            <React.Fragment>

                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <button className="btn btn-dark mx-auto" onClick={this.generateArrayHandle}>Generate New Array</button>
                        <div className="mx-auto">
                            <button className="btn btn-dark mx-1" onClick={this.selectionSort}>Selection Sort</button>
                            <button className="btn btn-dark mx-1">Insertion Sort</button>
                            <button className="btn btn-dark mx-1">Quick Sort</button>
                        </div>
                    </div>
                </nav>


                <div className="array-container">
                    {array.map((value, index) => (
                        <div className="array-bar" key={index} style={{height: `${value}px`}}></div>
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