import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'
import './index.css'

const LoginForm = () => {
  const location = useLocation()

  useEffect(() => {
    const getHashKeyFromLocationAfterLogin = () => {
      console.log(location)
      const { hash } = location
      const hashKey = {}

      const queryParams = new URLSearchParams(window.location.search)
      const error = queryParams.get('error')

      if (error === 'access_denied') {
        window.close()
      }

      hash
        .replace(/^#\/?/, '')
        .split('&')
        .forEach(keyValue => {
          const spl = keyValue.indexOf('=')
          if (spl !== -1) {
            hashKey[keyValue.substring(0, spl)] = keyValue.substring(spl + 1)
          }
        })
      return hashKey
    }

    const postHashKeyAsMessage = hashKey => {
      window.opener.postMessage(
        JSON.stringify({
          type: 'access_token',
          access_token: hashKey.access_token,
          expires_in: hashKey.expires_in || 0,
        }),
        '*',
      )
      window.close()
    }

    const getMessageAndsetAccessTokenInCookies = () => {
      window.addEventListener(
        'message',
        event => {
          const hash = event.data
          console.log(hash.type)
          if (hash.type === 'access_token') {
            const oneHour = new Date(new Date().getTime() + 60 * 60 * 1000)
            Cookies.set('pa_token', hash.access_token, {
              expires: oneHour,
            })
            window.location.replace('/')
          }
        },
        false,
      )
    }

    // Your logic using location...
    const hashKey = getHashKeyFromLocationAfterLogin()
    if (hashKey.webpackOk) {
      postHashKeyAsMessage(hashKey)
    }
    getMessageAndsetAccessTokenInCookies()

  }, [location])

  const isDevelopmentEnvironment = () => {
    if (
      process.env.NODE_ENV === 'development' ||
      window.location.hostname === 'localhost'
    ) {
      return true
    }
    return false
  }

  const getRedirectURL = () => {
    if (isDevelopmentEnvironment()) {
      return 'http://localhost:3004/login'
    }
    return 'https://ganeshspotify.ccbp.tech/login'
  }

  const openLoginModal = () => {
    const clientId = 'b70cf54cdbfc4a0484af7e45f33da0e5'

    const redirectUrl = getRedirectURL()
    console.log(redirectUrl)

    const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUrl}&scope=user-read-private%20user-read-email%20playlist-read-private%20playlist-modify-public%20playlist-modify-private%20user-library-read%20user-library-modify%20user-follow-read%20user-follow-modify&state=34fFs29kd09&show_dialog=true`

    const width = 450
    const height = 730
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2

    window.open(
      url,
      'Spotify',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`,
    )
  }

  const submitForm = async event => {
    event.preventDefault()
    openLoginModal()
  }

  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/spotify-remix-login-music.png"
          className="login-website-logo-desktop-image"
          alt="website logo"
        />
        <button type="submit" className="login-button">
          LOG IN SPOTIFY REMIX
        </button>
      </form>
    </div>
  )
}

export default LoginForm
