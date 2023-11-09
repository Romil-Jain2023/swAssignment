import React from 'react';

export type ImageProps = {
    image: string;
};

const Image: React.FC<ImageProps> = (props: ImageProps): JSX.Element => {
    return (
        <img className="image" src={props.image} />
    )
};
export default Image;