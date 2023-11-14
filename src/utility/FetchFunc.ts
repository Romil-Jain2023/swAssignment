import {URLArr} from '../images/ImagesArr';

export const fetchImage = async (val: number) => {
    let res = await fetch(URLArr[val]);
    let res1 = await res.blob();
    let image = URL.createObjectURL(res1);
    return image;
};