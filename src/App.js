import React, { useState, useEffect, useRef } from 'react';
import 'intersection-observer';
import { LIMIT } from './utils/constants';
import Comment from './component/Comment/Comment';
import styled from 'styled-components';

export default function App() {
  const [totalData, setTotalData] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const target = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=${LIMIT}`,
      {
        method: 'GET',
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalData((prev) => prev.concat(data));
        setIsLoading(false);
      });
  }, [page]);

  const onIntersect = ([entry]) => {
    if (entry.isIntersecting && !loading) setPage((prev) => prev + 1);
  };

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
      observer.observe(target.current);
    }
    return () => observer && observer.disconnect();
  }, [loading]);

  return (
    <Container>
      <Wrap>
        <Comment data={totalData} />
      </Wrap>
      <Loding ref={target}>{loading && 'Loading...'}</Loding>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

const Wrap = styled.div`
  width: 500px;
  margin-top: 26px;
`;

const Loding = styled.div`
  font-size: 100px;
`;
