export default class MovieService {
  constructor() {
    this.transformMovie = (movie) => ({
      id: movie.id,
      title: movie.title,
      genreIds: movie.genre_ids,
      posterPath: movie.poster_path,
      overview: movie.overview,
      releaseDate: movie.release_date,
      rate: movie.vote_average.toFixed(1),
      votes: movie.vote_count,
    })
  }

  apiBase = 'https://api.themoviedb.org/3'

  apiKey = '4f9c0c4d1965a4d80f8ccb64b31a375d'

  getResource = async (url) => {
    const res = await fetch(`${this.apiBase}${url}`)
    if (!res.ok) {
      throw new Error(`${res.status}`)
    }
    const body = await res.json()
    return body
  }

  getMovies = async (searchQuery, page) => {
    let query = searchQuery
    if (searchQuery === '') query = 'return'
    const url = `/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`
    const body = await this.getResource(url)
    const movies = body.results.map((movie) => this.transformMovie(movie))
    return {
      movies,
      totalResults: body.total_results,
    }
  }

  getGenresList = async () => {
    const url = `/genre/movie/list?api_key=${this.apiKey}`
    const body = await this.getResource(url)
    const genres = body.genres.reduce((acc, cur) => {
      const { id, name } = cur
      acc[id] = name
      return acc
    }, {})
    return genres
  }

  checkGuestSession = async (guestSessionId) => {
    const url = `/guest_session/${guestSessionId}?api_key=${this.apiKey}`
    const body = await this.getResource(url)
    return body.success
  }

  newGuestSession = async () => {
    const oldGuestSessionId = localStorage.getItem('guestSessionId')
    let newGuestSessionId = ''
    if (oldGuestSessionId !== null) {
      if (this.checkGuestSession(oldGuestSessionId)) {
        newGuestSessionId = oldGuestSessionId
      }
    } else {
      const body = await this.getResource(`/authentication/guest_session/new?api_key=${this.apiKey}`)
      localStorage.clear()
      newGuestSessionId = body.guest_session_id
      localStorage.setItem('guestSessionId', newGuestSessionId)
    }
    return newGuestSessionId
  }

  rateMovie = async (movieId, rate, guestSessionId) => {
    const url = `/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`
    const res = await fetch(`${this.apiBase}${url}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rate,
      }),
    })
    const body = await res.json()
    return body
  }

  unrateMovie = async (movieId, guestSessionId) => {
    const url = `/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`
    const res = await fetch(`${this.apiBase}${url}`, {
      method: 'DELETE',
    })
    const body = await res.json()
    return body
  }

  getRatedMovies = async (guestSessionId, page) => {
    const url = `/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${page}`
    const body = await this.getResource(url)
    const ratedMovies = body.results.map((movie) => this.transformMovie(movie))
    return {
      ratedMovies,
      totalRated: body.total_results,
    }
  }
}
