import axios from 'axios'

export interface OpenLibraryBook {
    title: string
    author: string
    isbn: string
    genre: string
    coverUrl?: string
    coverId?: number
}

export const searchBooks = async (query: string): Promise<OpenLibraryBook[]> => {
    if (!query || query.length < 3) return []

    const response = await axios.get(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=8&fields=title,author_name,isbn,subject,cover_i`
    )

    return response.data.docs.map((doc: any) => ({
        title: doc.title || '',
        author: doc.author_name?.[0] || '',
        isbn: doc.isbn?.[0] || '',
        genre: doc.subject?.[0] || '',
        coverId: doc.cover_i || null,
        coverUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
            : null,
    }))
}