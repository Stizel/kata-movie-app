import React from 'react'
import 'antd/dist/antd.min.css'
import { Card, Col, Image, Rate, Tag } from 'antd'
import { format } from 'date-fns'

import descCut from './desc-cut'

import './movie.css'

function Movie({ movie }) {
  const posterURL = 'https://image.tmdb.org/t/p/w500/'
  const { title, poster_path: posterPath, overview, release_date: releaseDate } = movie

  return (
    <Col lg={12} md={24}>
      <Card className="card">
        <Image className="card__img" src={posterURL + posterPath} alt={title} />
        <div className="card__info">
          <h2 className="card__title">{title}</h2>
          <span className="card__date"> {format(new Date(releaseDate), 'MMMM d, yyyy')} </span>
          <div className="card__genres genres">
            <Tag className="genres__item">Action</Tag>
            <Tag className="genres__item">Drama</Tag>
          </div>
          <p className="card__description">{descCut(overview, { title }.title.length)}</p>
          <Rate className="card__rate" />
        </div>
      </Card>
    </Col>
  )
}
export default Movie
