import React, { Component } from 'react'
import 'antd/dist/antd.min.css'
import './app.css'
import { Alert, Pagination } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'

import MoviesList from '../movie-list/movies-list'
import MovieService from '../../services/movie-service'
import Header from '../header/header'

export default class App extends Component {
  movieService = new MovieService()

  constructor() {
    super()

    this.state = {
      movies: [],
      query: '',
      page: 1,
      status: 'loading',
      totalResults: 0,
    }

    this.moviesOnLoaded = (res) => {
      if (res.totalResults === 0) {
        this.setState({
          status: 'no-content',
        })
      } else {
        this.setState({
          movies: res.movies,
          totalResults: res.totalResults,
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

    this.paginationHandler = (page) => {
      this.setState({
        page,
      })
    }

    this.inputHandler = (query) => {
      this.setState({
        query,
      })
    }
  }

  componentDidMount() {
    this.getMovies()
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, query } = this.state

    if (query !== prevState.query) {
      this.setState({ status: 'loading', page: 1, totalResults: 0 })
      this.getMovies()
    } else if (page !== prevState.page) {
      this.setState({ status: 'loading' })
      this.getMovies()
    }
  }

  render() {
    const { movies, status, page, totalResults } = this.state
    return (
      <div className="app">
        <Header inputHandler={debounce(this.inputHandler, 1500)} />
        <Offline>
          <Alert
            message="You have no internet connection"
            description="please check your internet cable"
            type="error"
            showIcon
          />
        </Offline>
        <Online>
          <MoviesList movies={movies} status={status} />
          <Pagination
            className="pagination"
            current={page}
            pageSize={20}
            total={totalResults}
            onChange={(num) => this.paginationHandler(num)}
            hideOnSinglePage
          />
        </Online>
      </div>
    )
  }
}
