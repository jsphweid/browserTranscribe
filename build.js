const s3 = require('s3')
const awscred = require('awscred')

const bucketName = 'josephweidinger.com'

function s3ClientCreator(accessKeyId, secretAccessKey, region) {
    const clientConfig = {
        maxAsyncS3: 20,
        s3RetryCount: 3,
        s3RetryDelay: 1000,
        multipartUploadThreshold: 20971520,
        multipartUploadSize: 15728640,
        s3Options: { accessKeyId, secretAccessKey, region }
    }

    return s3.createClient(clientConfig)
}

function uploadDir(s3Client, localDir, remoteDir, deleteRemoved = false) {
    const params = {
        deleteRemoved,
        localDir,
        s3Params: {
            Bucket: bucketName, 
            Prefix: remoteDir
        }
    }
    
    return new Promise((resolve, reject) => {
        var uploader = s3Client.uploadDir(params);
        uploader.on('error', (err) => {
            console.error("unable to upload / sync:", err.stack)
        })
        uploader.on('progress', () => {
            console.log("uploading progress", uploader.progressAmount, uploader.progressTotal)
        })
        uploader.on('end', () => {
            resolve()
        })
    })
}


function getAwsCreds() {
    return new Promise((resolve) => {
        awscred.load({ profile: 'default' }, (err, data) => {
            if (err) {
                console.error('"awscred" could not load your default credentials')
                throw err
            }
            resolve(data)
        })
    })
}

let s3Client = null

getAwsCreds()
    .then((data) => {
        
        const { region, credentials: { accessKeyId, secretAccessKey } } = data
        s3Client = s3ClientCreator(accessKeyId, secretAccessKey, region)
        return uploadDir(s3Client, './build/', 'browserTranscribe/', true)

    }).then(() => {

        console.log(`successfully updated bucket`)

    }).catch((error) => console.error('-error', error))
