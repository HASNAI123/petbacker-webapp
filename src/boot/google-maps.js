export default ({ Vue }) => {
  // adding the script tag to the head as suggested before
  var head = document.getElementsByTagName('head')[0]
  var script = document.createElement('script')
  script.async = true
  script.defer = true
  script.type = 'text/javascript'
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_KEY}&libraries=places`

  // fire the loading
  head.appendChild(script)

  // Remove resize observe to make rooms for other errors in bugsnag
  window.ResizeObserver = undefined
}
