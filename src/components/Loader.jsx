import React from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Spinner = styled.div`
  border: 5px solid #e1f5fe; /* Light background color */
  border-top: 5px solid #38a169; /* Green spinner color */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <Spinner />
    </LoaderContainer>
  );
};

export default Loader;