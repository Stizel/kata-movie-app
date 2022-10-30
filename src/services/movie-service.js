export default class MovieService {
  apiBase = 'https://api.themoviedb.org/3'

  apiKey = '4f9c0c4d1965a4d80f8ccb64b31a375d'

  getResource = async (url) => {
    const res = await fetch(`${this.apiBase}${url}`)

    if (!res.ok) {
      throw new Error(`${res.status}`)
    }
    return res
  }

  getMovies = async (searchQuery, page) => {
    let query = searchQuery
    if (searchQuery === '') query = 'return'
    const url = `/search/movie?api_key=${this.apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
    const res = await this.getResource(url)
    const body = await res.json()
    console.log(body)
    return {
      movies: body.results,
      totalResults: body.total_results,
    }
  }

  getGenres = async (movieId) => {
    const url = `/movie/${movieId}?api_key=${this.apiKey}&language=en-US`
    const res = await this.getResource(url)
    const body = await res.json()
    const genres = body.genres.map((genre) => genre.name)
    return genres
  }
}
const movieService = new MovieService()

movieService.getGenres(43641)
