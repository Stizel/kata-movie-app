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
      searchPage: 1,
      ratedPage: 1,
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
      const { query, searchPage } = this.state
      this.movieService.getMovies(query, searchPage).then(this.moviesOnLoaded).catch(this.onError)
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
      const { selectedTab } = this.state
      if (selectedTab === 'search') {
        this.setState({
          searchPage: page,
        })
      } else {
        this.setState({
          ratedPage: page,
        })
      }
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

    this.getRatedMovies = () => {
      const { guestSessionId, ratedPage } = this.state
      this.movieService.getRatedMovies(guestSessionId, ratedPage).then(this.getRatedMoviesOnLoaded)
    }

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
    const { searchPage, ratedPage, query, selectedTab, status } = this.state

    if (query !== prevState.query) {
      this.setState({ status: 'loading-movies', searchPage: 1, totalResults: 0 })
    }
    if (searchPage !== prevState.searchPage) {
      this.setState({ status: 'loading-movies' })
    }

    if (selectedTab !== prevState.selectedTab && selectedTab === 'rated') {
      this.setState({ status: 'loading-rated' })
    }
    if (ratedPage !== prevState.ratedPage) {
      this.setState({ status: 'loading-rated' })
    }

    if (status !== prevState.status) {
      if (status === 'loading-movies') {
        this.getMovies()
      } else if (status === 'loading-rated') {
        this.getRatedMovies()
      }
    }
  }

  render() {
    const {
      movies,
      genres,
      status,
      searchPage,
      ratedPage,
      totalResults,
      selectedTab,
      ratedMovies,
      totalRated,
      localRatedMovies,
    } = this.state
    const totalMovies = selectedTab === 'search' ? totalResults : totalRated
    const page = selectedTab === 'search' ? searchPage : ratedPage
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
