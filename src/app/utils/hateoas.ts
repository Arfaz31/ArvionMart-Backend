interface Link {
  href: string
  rel: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}

// The 'req' parameter is removed as it's no longer needed
export const generateHateoasLinks = (data: any, path: string): Link[] => {
  // baseUrl now starts with a '/' to make it a root-relative path
  const baseUrl = `/api/v1/${path}`
  const links: Link[] = [
    { href: `${baseUrl}/${data._id}`, rel: 'self', method: 'GET' },
    { href: `${baseUrl}/${data._id}`, rel: 'update', method: 'PATCH' },
    { href: `${baseUrl}/${data._id}`, rel: 'delete', method: 'DELETE' },
  ]
  return links
}

// The 'req' parameter is removed here as well
export const generatePaginationLinks = (
  meta: any,
  path: string
): Record<string, string> => {
  // baseUrl is now a root-relative path
  const baseUrl = `/api/v1/${path}`
  const { page, limit, totalPage } = meta

  const links: Record<string, string> = {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`,
    last: `${baseUrl}?page=${totalPage}&limit=${limit}`,
  }

  if (page > 1) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`
  }
  if (page < totalPage) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`
  }

  return links
}
