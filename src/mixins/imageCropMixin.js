/**
 * Crop 2 images and form into single image
 */
export default {
  data () {
    return {
      imageLeft: null,
      imageRight: null,
      imagesLoaded: 0,
      canvas: null,
      context: null
    }
  },
  methods: {
    processImages (leftImage, rightImage) {
      this.canvas = this.$refs['canvas']
      this.context = this.canvas.getContext('2d')

      this.imageLeft = this.loadImage(leftImage, this.onImageLoaded)
      this.imageRight = this.loadImage(rightImage, this.onImageLoaded)
    },
    onImageLoaded () {
      this.imagesLoaded += 1

      if (this.imagesLoaded === 2) {
        // composite now
        // adjust image sandbox here: https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_canvas_drawimage3
        this.drawImageProp(this.context, this.imageLeft, 0, 0, this.canvas.width / 2, this.canvas.height)
        this.drawImageProp(this.context, this.imageRight, this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height)

        this.drawHeaderBox(this.context)

        const canvasData = this.canvas.toDataURL('image/jpeg', 0.86)
        this.$emit('canvas-data', canvasData)
      }
    },
    drawHeaderBox (ctx) {
      ctx.globalAlpha = 0.6
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, this.canvas.width / 2, 30)
      ctx.fillRect(this.canvas.width / 2, 0, this.canvas.width / 2, 30)
      ctx.globalAlpha = 1.0

      ctx.font = '16px Roboto'
      ctx.fillStyle = 'black'
      ctx.fillText('Before', Math.floor(this.canvas.width / 2) / 3, 20)

      ctx.font = '16px Roboto'
      ctx.fillStyle = 'black'
      ctx.fillText('After', (Math.floor(this.canvas.width / 2) / 3) + (this.canvas.width / 2) + 20, 20)

      // draw white line
      ctx.beginPath()
      ctx.strokeStyle = 'white'
      // Staring point (10,45)
      ctx.moveTo(this.canvas.width / 2, 0)
      // End point (180,47)
      ctx.lineTo(this.canvas.width / 2, this.canvas.height)
      // Make the line visible
      ctx.stroke()
    },
    drawImageProp (ctx, img, x, y, w, h, offsetX, offsetY) {
      if (arguments.length === 2) {
        x = y = 0
        w = ctx.canvas.width
        h = ctx.canvas.height
      }

      // default offset is center
      offsetX = typeof offsetX === 'number' ? offsetX : 0.5
      offsetY = typeof offsetY === 'number' ? offsetY : 0.5

      // keep bounds [0.0, 1.0]
      if (offsetX < 0) offsetX = 0
      if (offsetY < 0) offsetY = 0
      if (offsetX > 1) offsetX = 1
      if (offsetY > 1) offsetY = 1

      var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, // new prop. width
        nh = ih * r, // new prop. height
        cx, cy, cw, ch, ar = 1

      // decide which gap to fill
      if (Math.round(nw) < w) ar = w / nw
      if (Math.abs(ar - 1) < 1e-14 && Math.round(nh) < h) ar = h / nh // updated
      nw *= ar
      nh *= ar

      // calc source rectangle
      cw = iw / (nw / w)
      ch = ih / (nh / h)

      cx = (iw - cw) * offsetX
      cy = (ih - ch) * offsetY

      // make sure source rectangle is valid
      if (cx < 0) cx = 0
      if (cy < 0) cy = 0
      if (cw > iw) cw = iw
      if (ch > ih) ch = ih

      // fill image in dest. rectangle
      ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
    },
    loadImage (src, onload) {
      // http://www.thefutureoftheweb.com/blog/image-onload-isnt-being-called
      var img = new Image()

      img.onload = onload
      img.src = src

      return img
    }
  }
}
