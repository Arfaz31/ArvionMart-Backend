import * as crypto from 'crypto'

export const generateEtag = (data: any): string => {
  if (!data) {
    // Return an empty ETag for null or undefined data
    return '""'
  }
  const hash = crypto.createHash('sha1')
  hash.update(JSON.stringify(data))
  // ETags should be wrapped in double quotes as per the HTTP spec
  return `"${hash.digest('hex')}"`
}
