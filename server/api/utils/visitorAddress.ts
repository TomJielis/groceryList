import {getRequestHeader, type H3Event} from 'h3'

// The API sees this server as the caller; this is who really made the request, to pass on as X-Forwarded-For
// (for failed-login records and rate limits). In production the Cloudflare tunnel connects from this machine
// and puts the visitor's address in CF-Connecting-IP. That header is only believed from the tunnel itself,
// so a visitor can't fake it. (No address at all means a local socket, e.g. the dev server internally.)
export function visitorAddress(event: H3Event): string {
    const socketAddress = event.node.req.socket.remoteAddress ?? ''
    const fromThisMachine = ['', '127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(socketAddress)
    return (fromThisMachine && getRequestHeader(event, 'cf-connecting-ip')) || socketAddress
}

export function forwardedForHeader(event: H3Event): Record<string, string> {
    const address = visitorAddress(event)
    return address ? {'X-Forwarded-For': address} : {}
}
