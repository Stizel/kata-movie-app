import { Row, Spin, Alert } from 'antd'
import PropTypes from 'prop-types'

import Movie from '../movie/movie'
import './movies-list.css'

export default function MoviesList({ movies, status, selectedTab, ratedMovies, rateHandler }) {
  let content
  const showMovies = selectedTab === 'search' ? movies : ratedMovies
  switch (status) {
    case 'no-content':
      content = (
        <Alert message="No movies for this request" description="Try different request" type="warning" showIcon />
      )
      break
    case 'error':
      content = (
        <Alert
          message="Something has gone wrong"
          description="Can't get the movies, please go to another site"
          type="error"
          showIcon
        />
      )
      break
    case 'loading':
      content = <Spin size="large" />
      break
    default:
      content = showMovies.map((movie) => {
        const { id } = movie
        return <Movie key={id} movie={movie} rateHandler={rateHandler} />
      })
  }
  return (
    <div className="movies-list">
      <Row gutter={[36, 35]}>{content}</Row>
    </div>
  )
}

MoviesList.defaultProps = {
  movies: [],
  status: 'loading',
  ratedMovies: [],
  rateHandler: () => {},
}
MoviesList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.objectOf),
  status: PropTypes.string,
  ratedMovies: PropTypes.arrayOf(PropTypes.objectOf),
  rateHandler: PropTypes.func,
}
