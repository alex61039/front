/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ContentLoader from 'react-content-loader';

const ProposalLoader = (props) => (
  <ContentLoader
    className="loader"
    speed={2}
    width={745}
    height={50}
    viewBox="0 0 745 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="745" height="40" />
  </ContentLoader>
);

export default ProposalLoader;
