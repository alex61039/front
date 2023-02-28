/* eslint-disable react/jsx-props-no-spreading */
import React, {
  FC, MouseEvent, useEffect, useRef, useState,
} from 'react';
import cx from 'classnames';
import ReactDOM from 'react-dom';
import evaluateHintPosition from 'src/helpers/evaluateHintPosition';
import s from './withHint.module.css';

interface WithHintProps {
  hint: string;
}

function withHint<T>(Component: FC) {
  return ({ hint, ...props }: T & WithHintProps) => {
    const hintContentRef = useRef<HTMLDivElement>(null);
    const [isOpened, setIsOpened] = useState<boolean>(false);

    useEffect(() => {
      if (!hint) {
        setIsOpened(false);
      }
    }, [hint]);

    const handleMouseEnter = ({ target }: MouseEvent) => {
      if (!hintContentRef.current || !hint) {
        return;
      }

      const hintContent = hintContentRef.current;

      const {
        top,
        right,
        left,
      } = evaluateHintPosition(target, hintContent);

      hintContent.style.left = left;
      hintContent.style.top = top;
      hintContent.style.right = right;

      setIsOpened(true);
    };

    const handleMouseLeave = () => {
      setIsOpened(false);
    };

    return (
      <div
        className={s.hint}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Component {...props} />
        {ReactDOM.createPortal(
          (
            <div
              ref={hintContentRef}
              className={cx(s.hint__menu, { [s.hint__menu__hidden]: !isOpened })}
            >
              {hint}
            </div>
          ), document.body,
        )}
      </div>
    );
  };
}

export default withHint;
