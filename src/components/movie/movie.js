import React, { Component } from 'react'
import { Col, Rate, Image } from 'antd'
import { format } from 'date-fns'

import MovieService from '../../services/movie-service'

import 'antd/dist/antd.min.css'
import './movie.css'
import noPoster from './no-poster.jpg'

export default class Movie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      genres: [],
    }
  }

  render() {
    const posterURL = 'https://image.tmdb.org/t/p/w500'
    const { movie } = this.props
    const { id, title, poster_path: posterPath, overview, release_date: releaseDate, vote_average: rate } = movie
    const poster = posterPath ? posterURL + posterPath : noPoster
    const formatedDate = releaseDate ? <div className="movie__date">{format(new Date(releaseDate), 'PP')}</div> : null
    const movieService = new MovieService()

    movieService.getGenres(id).then((genres) =>
      this.setState({
        genres: genres.slice(0, 5),
      })
    )

    const { genres } = this.state
    const genrez = genres.map((genre) => (
      <span key={id + genre} className="movie__genre">
        {genre}
      </span>
    ))

    function strCut(str, length) {
      if (str.length < length) {
        return str
      }
      const newStr = str.substring(0, length)
      const lastSpace = newStr.lastIndexOf(' ')
      let shortDesc = newStr.slice(0, lastSpace)
      if (/[.,:]/.test(shortDesc.split(' ').pop())) {
        shortDesc = shortDesc.slice(0, -1)
      }
      return `${shortDesc}...`
    }

    return (
      <Col md={12} xs={24}>
        <div className="movie">
          <div className="movie__img-wrapper">
            <Image src={poster} alt={title} width="100%" preview={Boolean(posterPath)} />
          </div>
          <div className="movie__info">
            <header className="movie__header">
              <h2 className="movie__title">{strCut(title, 35)}</h2>
              {formatedDate}
              <div className="movie__genres">{genrez}</div>
            </header>

            <div className="movie__description">{strCut(overview, 100)}</div>
            <Rate count={10} value={rate} className="movie__stars" />
            <div className="movie__rate">{rate}</div>
          </div>
        </div>
      </Col>
    )
  }
}
