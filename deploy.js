const s3BasicHelper = require('s3-basic-helper').default

const s3Helper = new s3BasicHelper('us-east-1', 'default')
s3Helper.uploadDir('josephweidinger.com', './build/', 'browserTranscribe/', true)
