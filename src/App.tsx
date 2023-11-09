import React, { useState, useEffect } from 'react';
import ButtonToggle from './component/ButtonToggle';
import Image from './component/Image';
import './css/app.css';

const App: React.FC = (): JSX.Element => {
  let [count, setCount] = useState<number>(1);
  let [image, setImage] = useState('./models/image1.jpg');

  useEffect(() => {
    setImage(`./models/image${count}.jpg`);
  }, [count]);

  const updateCount = (val: number): void => {
    setCount(val);
  };

  return (
    <div className="container">
      <Image image={image} />
      <ButtonToggle count={count} updateCount={updateCount} />
    </div>
  )
};

export default App;


// const fetchImage = async (val: number) => {
// let res = await fetch(`./models/image${val}.jpg`);
// let res1 = await res.blob();
// let image = URL.createObjectURL(res1);
// setImage(image);