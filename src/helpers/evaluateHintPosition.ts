const evaluateHintPosition = (hintIconElement: EventTarget, hintContentElement: HTMLElement) => {
  const {
    top,
    left,
    width: hintWidth,
    height: hintHeight,
  } = (hintIconElement as HTMLElement).getBoundingClientRect();

  const {
    width: hintContentWidth,
    height: hintContentHeight,
  } = hintContentElement.getBoundingClientRect();

  let hintContentTop = 'unset';
  let hintContentLeft = 'unset';
  let hintContentRight = 'unset';

  if (top + hintContentHeight < window.innerHeight) {
    hintContentTop = `${top + window.pageYOffset + hintHeight}px`;
  } else {
    hintContentTop = `${top + window.pageYOffset - hintContentHeight}px`;
  }

  if (left + hintContentWidth < window.innerWidth) {
    hintContentLeft = `${left + window.pageXOffset + hintWidth}px`;
  } else if (left <= window.innerWidth / 2 && left < hintContentWidth) {
    hintContentLeft = '15px';
  } else if (left > window.innerWidth / 2) {
    hintContentRight = '15px';
  } else {
    hintContentLeft = `${left + window.pageXOffset - hintContentWidth}px`;
  }

  return {
    top: hintContentTop,
    left: hintContentLeft,
    right: hintContentRight,
  };
};

export default evaluateHintPosition;
