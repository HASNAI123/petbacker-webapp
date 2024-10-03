import ImageTools from 'assets/ImageTools.js'
export default {
  data () {
    return {
      imageUploadUrl: 'imageupload',
      mediaSource: navigator.camera ? navigator.camera.PictureSourceType.PHOTOLIBRARY : null,
      cameraDirection: navigator.camera ? navigator.camera.Direction.BACK : null,
      mediaType: navigator.camera ? navigator.camera.MediaType.PICTURE : null,
      decodedpath: null
    }
  },
  destroy () {
    /**
     * Clean up any temp memory
     */
    navigator.camera.cleanup(() => {
      console.log('Camera cleanup success.')
    }, (err) => {
      console.error(err)
    })
  },
  methods: {
    onImageUpload (imageBlobData) {
      // create file form data
      let formData = new FormData()
      formData.append('imagefile', imageBlobData, 'image.jpg')

      let vm = this
      vm.$axios.post(this.imageUploadUrl, formData)
        .then((response) => {
          let mediaInfo = {
            'contentType': 'image',
            'fileName': response.data.imageName,
            'filePath': response.data.imagePath
          }

          let reader = new FileReader()
          reader.readAsDataURL(imageBlobData)
          reader.onloadend = () => {
            vm.$emit('image-info', reader.result, mediaInfo)
          }
        }).catch(e => {
          console.error(e)
          vm.$q.notify(e.response.data.message)
        }).finally(_ => {
          vm.loader = false
        })
    },
    processFile (fileData, fileName, thumbnailBlob) {
      // Extract file type
      let fileType = fileName.split('.').pop()
      if (fileType.includes('?')) {
        fileType = fileType.split('?')[0]
      }
      // set valid formats base on mediaType
      // image supports: jpg, jpeg & png
      // video supports: mov, mp4
      let validFormats = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']
      if (this.mediaType === navigator.camera.MediaType.VIDEO) {
        validFormats = ['MOV', 'mov', 'MP4', 'mp4']
      } else if (this.mediaType === navigator.camera.MediaType.ALLMEDIA) {
        validFormats = validFormats.concat(['MOV', 'mov', 'MP4', 'mp4'])
        console.log('is it concatng', validFormats)
      }
      // check valid file type
      if (fileType === 'mp4') {
      }
      /* if (!validFormats.includes(fileType.toLowerCase())) {
        this.$q.dialog({
          message: this.$t('only.jpeg.png'),
          type: 'negative',
          position: 'bottom'
        })
        return
      } */

      // resolve and get file
      window.resolveLocalFileSystemURL(fileData, (fileEntry) => {
        fileEntry.file((file) => {
          let vm = this
          let filePath = fileData

          // convert to WKWEBVIEW valid url
          if (this.$q.platform.is.ios) {
            filePath = window.WkWebView.convertFilePath(fileData)
          }
          if (fileType === 'MOV' || fileType === 'mov' || fileType === 'MP4' || fileType === 'mp4') {
            // process video file
            this.fileURItoBlob(file, file.type).then((blob) => {
              console.log('Called')
              vm.$emit('image-data', {blob: blob, url: filePath, thumbnail: thumbnailBlob})
            }).catch((error) => {
              console.error(error)
              if (error.message === 'Maximum video file limit (20MB) reached.') {
                this.$q.dialog({
                  message: 'Oops, looks like your video is too large for us. Please only upload video length of up to within 15 seconds',
                  type: 'negative',
                  position: 'bottom'
                })
              }
            })
          } else {
            // process image file
            ImageTools.resize(file, (blob, acceptableSize) => {
              if (acceptableSize === false) {
                /*  vm.$q.dialog({
                  message: vm.$t('only.jpeg.png'),
                  type: 'negative',
                  position: 'bottom'
                }) */
              } else {
                vm.$emit('image-data', {blob: blob, url: filePath})
              }
            })
          }
        }, (error) => {
          console.error(error)
        })
      })
    },

    onSuccess (imageData) {
      // Extract file name
      console.log('on-success', imageData)
      if (!imageData.includes('content://com.android') && !imageData.includes('file://')) {
        imageData = 'file:///' + imageData
      }
      console.log('on-success', imageData)

      // this part checks  handles the file URI local
      if (imageData.includes('content://com.android')) {
        window.FilePath.resolveNativePath(imageData, (absolutePath) => {
          window.resolveLocalFileSystemURL(absolutePath, (fileEntry) => {
            fileEntry.file((file) => {
              // Read file using chunk streaming
              let fileSize = file.size
              let chunkSize = 1024 * 1024 // 1MB
              let offset = 0
              let reader = new FileReader()

              reader.onload = (event) => {
                // Process file data

                offset += event.target.result.byteLength

                if (offset < fileSize) {
                  readSlice(offset)
                }
              }

              reader.onerror = (event) => {
                console.error('Failed to read file:', event.target.error)
              }

              const readSlice = (start) => {
                let end = Math.min(start + chunkSize, fileSize)
                let slice = file.slice(start, end)

                reader.readAsArrayBuffer(slice)
              }
              readSlice(0)
              const localUrl = file.localURL
              const fileType = localUrl.split('.').pop()
              console.log(fileType) // Output: mp4

              let fileName = file.name
              if (absolutePath.toLowerCase().includes('jpg') || absolutePath.toLowerCase().includes('png')) {
                this.processFile(absolutePath, fileName)
              } else {
                this.processFile(absolutePath, fileName)
                /* this.createThumbnail(absolutePath, fileName).then(function (thumbnailBlob) {
                  console.log('Thumbnail created')
                  processFileWithThumbnail(thumbnailBlob)
                }).catch(function (error) {
                  console.error('Error creating thumbnail: ' + error)
                }) */
              }
              /* const processFileWithThumbnail = thumbnailBlob => {
                console.log('Thumbnail blob before passing to processfile', thumbnailBlob)
                this.processFile(absolutePath, fileName, thumbnailBlob)
              } */
            })
          })
        })
      }
      if (imageData.includes('mp4') || imageData.includes('mov')) {
        let fileName = imageData.substr(imageData.lastIndexOf('/') + 1)
        if (imageData.toLowerCase().includes('jpg') || imageData.toLowerCase().includes('png')) {
          this.processFile(imageData, fileName)
        } else {
          this.processFile(imageData, fileName)
        }
      } else {
        let fileName = imageData.substr(imageData.lastIndexOf('/') + 1)
        this.processFile(imageData, fileName)
      }
    },

    /**
     * Failed callback on obtaining image data
     * @param {String} message - error message
     */
    onFail (message) {
      if (message && message.toLowerCase() !== 'no image selected') {
        console.error(message)
        this.$q.notify({
          message: message,
          position: 'top',
          type: 'negative',
          timeout: 1000
        })
      }
    },
    /**
     * Convert File URI into to blob object for image upload through REST
     * @param {String} dataURI - file_uri of media
     * @param {String} contentType - data type
     */
    fileURItoBlob (dataURI, contentType = 'image/jpg') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        // Progress event listener to checl file size
        reader.onprogress = (event) => {
          if (event.total > 20971520) {
            // Do something if the total file size is more than 20MB
            this.$q.dialog({
              message: 'Oops, looks like your video is too large for us. Please only upload video length of up to within 15 seconds',
              type: 'negative',
              position: 'bottom'
            })
            console.log('Total file size is more than 20MB.')
            // Stop further reading of the file
            reader.abort()
          }
        }

        reader.onload = (evt) => {
          const blobObject = new Blob([reader.result], {type: contentType})

          // check blob size (caps max to 20MB)
          /* const size = ((blobObject.size) / (1024 * 1024)).toFixed(2)
          console.log(blobObject.byteLength)
          if (size > 20.0) {
            return reject(new Error('Maximum video file limit (20MB) reached.'))
          } */

          return resolve(blobObject)
        }

        reader.onerror = () => {
          reject(reader.error)
        }

        reader.readAsArrayBuffer(dataURI)
      })
    },

    /**
     * Driver function to trigger image selection
     * Modify "mediaType" to switch between camera and photo library selection
     * --------------------------------------------------------------------
     * By default, it should trigger native api according to its platform.
     * --------------------------------------------------------------------
     */
    onFileSelection (source) {
      this.mediaType = navigator.camera.MediaType.ALLMEDIA // Video and image by default
      if (source === 'camera') {
        this.mediaSource = navigator.camera.PictureSourceType.CAMERA
      }
      if (source === 'photoLibrary') {
        this.mediaSource = navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
      }
      if (source === 'listing') {
        console.log('check for conitional video')
        this.mediaType = navigator.camera.MediaType.PICTURE
      }
      // open android image gallery
      if ((this.$q.platform.is.android || this.$q.platform.is.ios) && navigator.camera) {
        navigator.camera.getPicture(this.onSuccess, this.onFail, {
          quality: 75,
          destinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType: this.mediaSource,
          encodingType: navigator.camera.EncodingType.JPEG,
          mediaType: this.mediaType,
          cameraDirection: this.cameraDirection,
          correctOrientation: true
        })
        return
      }

      this.$refs['selectedFile'].click()

      if (this.$q.platform.is.cordova) {
        this.$refs['selectedFile'].click()
      }
    }
  }
}
