import React from 'react';
import { ArrowType } from '../utility/ButtonHelper';
import '../styles/button.css';

export type ButtonProps = {
    updateCount: (val: string) => void;
};

const Button: React.FC<ButtonProps> = (props: ButtonProps): JSX.Element => {
    return (
        <div className='button-container'>
            <button className="left-button" onClick={() => { props.updateCount(ArrowType.LEFT) }}>&larr;</button>
            <button className="right-button" onClick={() => { props.updateCount(ArrowType.RIGHT) }}>&rarr;</button>
        </div>
    )
};

export default Button;