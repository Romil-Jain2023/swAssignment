import React from 'react';
import {ArrowType } from '../utility/ButtonHelper';
import '../css/button.css';

type ButtonProps = {
    count: number;
    updateCount: (val: number) => void;
};

const Button: React.FC<ButtonProps> = (props:ButtonProps): JSX.Element => {
    const maxImage = 20;
    
    const changeCount = (dir: ArrowType) => {
        if (dir === 'left') {
            if (props.count - 1 <= 0) {
                props.updateCount(maxImage);
            } else {
                props.updateCount(props.count - 1);
            }
        } else {
            if (props.count + 1 > maxImage) {
                props.updateCount(1);
            } else {
                props.updateCount(props.count + 1);
            }
        }
    }

    return (
        <div className='button-container'>
            <button className="left-button" onClick={() => { changeCount(ArrowType.LEFT) }}>&larr;</button>
            <button className="right-button" onClick={() => { changeCount(ArrowType.RIGHT) }}>&rarr;</button>
        </div>
    )
};

export default Button;