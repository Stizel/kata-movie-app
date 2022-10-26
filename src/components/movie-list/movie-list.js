import React from 'react'
import { Row } from 'antd'

import Movie from '../movie/movie'

function MovieList({ movies }) {
  const moviez = movies.map(({ id, ...movie }) => <Movie key={id} movie={movie} />)

  return <Row gutter={[36, 35]}>{moviez}</Row>
}

export default MovieList
