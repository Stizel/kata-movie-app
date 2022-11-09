import React, { Component } from 'react'
import 'antd/dist/antd.min.css'
import './app.css'
import { Alert, Pagination } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'

import { GenresProvider } from '../genres-context/genres-context'
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
      genres: [],
      selectedTab: 'search',
      ratedMovies: [],
      totalRated: 0,
      guestSessionId: null,
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

    this.genresOnLoaded = (genres) => {
      this.setState({
        genres,
      })
    }

    this.getGenres = () => {
      this.movieService.getGenresList().then(this.genresOnLoaded)
    }

    this.newGuestSessionOnLoaded = (guestSessionId) => {
      this.setState({
        guestSessionId,
      })
    }

    this.newGuestSession = () => {
      this.movieService.newGuestSession().then(this.newGuestSessionOnLoaded)
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
    this.tabHandler = (tab) => {
      this.setState({
        selectedTab: tab,
      })
    }

    this.getRatedMoviesOnLoaded = (res) => {
      this.setState({
        ratedMovies: res.ratedMovies,
        totalRated: res.totalRated,
        status: 'ok',
      })
    }

    this.getRatedMovies = (guestSessionId, page = 1) =>
      this.movieService.getRatedMovies(guestSessionId, page).then(this.getRatedMoviesOnLoaded)

    this.rateHandler = (id, value) => {
      const { guestSessionId } = this.state
      let userRates = {}
      const oldUserRates = JSON.parse(localStorage.getItem('userRates'))
      if (oldUserRates) {
        userRates = oldUserRates
      }
      if (value !== 0) {
        userRates[id] = value
        localStorage.setItem('userRates', JSON.stringify(userRates))
        this.movieService.rateMovie(id, value, guestSessionId).then(this.getRatedMovies(guestSessionId))
      } else {
        delete userRates[id]
        localStorage.setItem('userRates', JSON.stringify(userRates))
        this.movieService.unrateMovie(id, guestSessionId).then(this.getRatedMovies(guestSessionId))
      }
    }
  }

  componentDidMount() {
    this.getMovies()
    this.getGenres()
    this.newGuestSession()
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, query, selectedTab, guestSessionId } = this.state
    if (selectedTab !== prevState.selectedTab) {
      this.setState({ page: 1, status: 'loading' })
      this.getMovies()
      this.getRatedMovies(guestSessionId, page)
    }
    if (guestSessionId !== prevState.guestSessionId) {
      this.getRatedMovies(guestSessionId, page)
    }
    if (query !== prevState.query) {
      this.setState({ status: 'loading', page: 1, totalResults: 0 })
      this.getMovies()
    } else if (page !== prevState.page) {
      this.setState({ status: 'loading' })
      this.getMovies()
    }
  }

  render() {
    const { movies, genres, status, page, totalResults, selectedTab, ratedMovies, totalRated, localRatedMovies } =
      this.state
    const totalMovies = selectedTab === 'search' ? totalResults : totalRated
    return (
      <div className="app">
        <Header
          inputHandler={debounce(this.inputHandler, 1500)}
          selectedTab={selectedTab}
          tabHandler={this.tabHandler}
        />
        <Offline>
          <Alert
            message="You have no internet connection"
            description="please check your internet cable"
            type="error"
            showIcon
          />
        </Offline>
        <Online>
          <GenresProvider value={genres}>
            <MoviesList
              movies={movies}
              status={status}
              selectedTab={selectedTab}
              ratedMovies={ratedMovies}
              localRatedMovies={localRatedMovies}
              rateHandler={this.rateHandler}
            />
          </GenresProvider>
          <Pagination
            className="pagination"
            current={page}
            pageSize={20}
            total={totalMovies}
            onChange={(num) => this.paginationHandler(num)}
            hideOnSinglePage
          />
        </Online>
      </div>
    )
  }
}
