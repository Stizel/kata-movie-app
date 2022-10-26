import React, { Component } from 'react'

import 'antd/dist/antd.min.css'
import './app.css'

import MovieList from '../movie-list/movie-list'
import MovieService from '../../services/movie-service'

export default class App extends Component {
  movieService = new MovieService()

  constructor() {
    super()

    this.state = {
      movies: [],
      query: 'return',
      page: 1,
    }

    this.getMovies = () => {
      const { query, page } = this.state
      this.movieService.getMovies(query, page).then((movies) => {
        this.setState({ movies })
      })
    }

    this.getMovies()
  }

  render() {
    const { movies } = this.state
    return (
      <div className="container">
        <MovieList movies={movies} />
      </div>
    )
  }
}
