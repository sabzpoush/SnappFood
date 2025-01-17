function removeKeys(obj:object, keysToRemove:string[]) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
    );
  }

function removeKeysFromArrayOfObjects(arrayOfObjects:object[], keysToRemove:string[]) {
    return arrayOfObjects.map((obj:object) => {
      return removeKeys(obj, keysToRemove);
    });
}

export {removeKeys,removeKeysFromArrayOfObjects};