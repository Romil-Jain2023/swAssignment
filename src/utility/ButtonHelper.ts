export const enum ArrowType {
    LEFT = 'left',
    RIGHT = "right"
}

export const changeCount = (dir: string, count: number) => {
    const maxImage = 14;
    let res: number;

    if (dir === 'left') {
        if (count - 1 < 0) {
            res = maxImage;
        } else {
            res = count - 1;
        }
    } else {
        if (count + 1 > maxImage) {
            res = 1;
        } else {
            res = count + 1;
        }
    }
    return res;
};