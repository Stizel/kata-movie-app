import React, { Component } from 'react'
import 'antd/dist/antd.min.css'
import './app.css'
import { Alert, Pagination } from 'antd'
import { Offline } from 'react-detect-offline'

import MoviesList from '../movie-list/movies-list'
import MovieService from '../../services/movie-service'
import Header from '../header/header'

export default class App extends Component {
  movieService = new MovieService()

  constructor() {
    super()

    this.state = {
      movies: [],
      query: 'return',
      page: 1,
      status: 'loading',
      totalPages: 0,
    }

    this.moviesOnLoaded = (res) => {
      if (res.totalResults === 0) {
        this.setState({
          status: 'no-content',
        })
      } else {
        this.setState({
          movies: res.movies,
          totalPages: res.totalPages,
          status: 'ok',
        })
      }
    }
    this.onError = () => {
      this.setState({
        status: 'error',
      })
    }

    this.getMovies = () => {
      const { query, page } = this.state
      this.movieService.getMovies(query, page).then(this.moviesOnLoaded).catch(this.onError)
    }

    this.paginationHandler = (num) => {
      this.setState({
        page: num,
      })
      this.getMovies()
    }

    this.getMovies()
  }

  render() {
    const { movies, status, page, totalPages } = this.state

    return (
      <div className="app">
        <Header />
        <Offline>
          <Alert
            message="You have no internet connection"
            description="please check your internet cable"
            type="error"
            showIcon
          />
        </Offline>
        <MoviesList movies={movies} status={status} />
        <Pagination
          className="pagination"
          current={page}
          pageSize={20}
          total={totalPages}
          onChange={(num) => this.paginationHandler(num)}
          hideOnSinglePage
        />
      </div>
    )
  }
}
