import React, { Component } from 'react'
import { Col, Rate, Image } from 'antd'
import { format } from 'date-fns'
import PropTypes from 'prop-types'

import { GenresConsumer } from '../genres-context/genres-context'

import 'antd/dist/antd.min.css'
import './movie.css'
import noPoster from './no-poster.jpg'

export default class Movie extends Component {
  constructor(props) {
    super(props)
    const { movie } = this.props
    const { id } = movie
    this.state = {
      userRate: 0,
    }

    this.getUserRate = () => {
      if (JSON.parse(localStorage.getItem('userRates'))) {
        return JSON.parse(localStorage.getItem('userRates'))[id]
      }
      return null
    }
    this.strCut = (str, length) => {
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

    this.getGenres = (ids, genres) => {
      if ((!ids && !genres) || genres.length === 0) return null
      const idz = ids.slice(0, 5)
      const genre = idz.map((genreId) => (
        <span key={genreId} className="movie__genre">
          {genres[genreId]}
        </span>
      ))
      return genre
    }
    this.rateColor = (rate) => {
      if (rate <= 3) return '#E90000'
      if (rate > 3 && rate < 5) return '#E97E00'
      if (rate >= 5 && rate < 7) return '#E9D100'
      if (rate >= 7) return '#66E900'
      return null
    }
    this.onRateChange = (value) => {
      const { rateHandler } = this.props
      rateHandler(id, value)
      this.setState({
        userRate: value,
      })
    }
  }

  componentDidMount() {
    this.setState({
      userRate: this.getUserRate(),
    })
  }

  render() {
    const posterURL = 'https://image.tmdb.org/t/p/w500'
    const { userRate } = this.state
    const { movie } = this.props
    const { title, genreIds, posterPath, overview, releaseDate, rate } = movie
    const poster = posterPath ? posterURL + posterPath : noPoster
    const formatedDate = releaseDate ? <div className="movie__date">{format(new Date(releaseDate), 'PP')}</div> : null
    return (
      <GenresConsumer>
        {(genres) => (
          <Col md={12} xs={24}>
            <div className="movie">
              <div className="movie__img-wrapper">
                <Image src={poster} alt={title} width="100%" preview={Boolean(posterPath)} />
              </div>
              <div className="movie__info">
                <header className="movie__header">
                  <h2 className="movie__title">{this.strCut(title, 35)}</h2>
                  {formatedDate}
                  <div className="movie__genres">{this.getGenres(genreIds, genres)}</div>
                </header>

                <div className="movie__description">{this.strCut(overview, 100)}</div>
                <Rate
                  count={10}
                  value={userRate}
                  className="movie__stars"
                  onChange={(value) => this.onRateChange(value)}
                />
                <div className="movie__rate" style={{ borderColor: this.rateColor(rate) }}>
                  {rate}
                </div>
              </div>
            </div>
          </Col>
        )}
      </GenresConsumer>
    )
  }
}

Movie.defaultProps = {
  title: '',
  genreIds: [],
  posterPath: '',
  overview: '',
  releaseDate: '',
  rate: '',
  id: '',
}
Movie.propTypes = {
  title: PropTypes.string,
  genreIds: PropTypes.arrayOf(PropTypes.string),
  posterPath: PropTypes.string,
  overview: PropTypes.string,
  releaseDate: PropTypes.string,
  rate: PropTypes.string,
  id: PropTypes.string,
}
