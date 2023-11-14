import React, { useState, useEffect } from 'react';
import ButtonToggle from './component/ButtonToggle';
import Image from './component/Image';
import { fetchImage } from './utility/FetchFunc';
import { changeCount } from './utility/ButtonHelper';
import './styles/app.css';

const App: React.FC = (): JSX.Element => {
  let [count, setCount] = useState<number>(1);
  let [image, setImage] = useState<string>('');

  useEffect(() => {
    loadImages();
  }, [count]);

  const loadImages = async () => {
    let image = await fetchImage(count);
    setImage(image);
  }

  const updateCount = (val: string):void => {
    let res = changeCount(val, count);
    setCount(res);
  };

  return (
    <div className="container">
      <Image image={image} />
      <ButtonToggle updateCount={updateCount} />
    </div>
  )
};

export default App;