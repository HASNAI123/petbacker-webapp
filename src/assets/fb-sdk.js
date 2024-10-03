(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) {
    return
  }
  js = d.createElement(s)
  js.id = id
  js.src = `https://connect.facebook.net/en_US/sdk.js#version=v7.0&appId=${process.env.FB_APP_KEY}&xfbml=true&autoLogAppEvents=true`
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))
