import React, { ReactNode } from 'react';
import s from './Page.module.css';

type Props = {
  children: ReactNode
  headerComponent?: ReactNode
  footerComponent?: ReactNode
};

function Page(props: Props) {
  const {
    headerComponent,
    footerComponent,
    children,
  } = props;

  return (
    <div className={s.container}>
      {!!headerComponent && (
      <div>
        {headerComponent}
      </div>
      )}
      <div>
        <div>
          {children}
        </div>
      </div>
      {!!footerComponent && (
      <div>
        {footerComponent}
      </div>
      )}
    </div>
  );
}

export default Page;
