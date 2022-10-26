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
    const url = `/search/movie?api_key=${this.apiKey}&language=en-US&query=${searchQuery}&page=${page}&include_adult=false`
    const res = await this.getResource(url)
    const body = await res.json()
    const movies = body.results
    return movies
  }
}
