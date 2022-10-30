import React from 'react'
import { Row, Spin, Alert } from 'antd'

import Movie from '../movie/movie'
import './movies-list.css'

function MoviesList({ movies, status }) {
  // const moviez = movies.map((movie) => <Movie key={movie.id} movie={movie} />)

  let content

  switch (status) {
    case 'no-content':
      content = (
        <Alert message="No movies for this request" description="Try different request" type="warning" showIcon />
      )
      break
    case 'error':
      content = <Alert message="Something has gone wrong" description="Cant get movies" type="error" showIcon />
      break
    case 'loading':
      content = <Spin size="large" />
      break
    default:
      content = movies.map((movie) => <Movie key={movie.id} movie={movie} />)
  }
  return (
    <div className="movies-list">
      <Row gutter={[36, 35]}>{content}</Row>
    </div>
  )
}

export default MoviesList
