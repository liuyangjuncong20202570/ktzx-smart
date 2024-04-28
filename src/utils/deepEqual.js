function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }

        // 特殊处理数组
        if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
            if (!arrayDeepEqual(obj1[key], obj2[key])) {
                return false;
            }
        } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        } else if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

function arrayDeepEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (!deepEqual(arr1[i], arr2[i])) {
            return false;
        }
    }
    return true;
}

export {deepEqual};
