function GetTestURL(path)
{
	var albumBucketName = 'god-of-interview-streaming';
var bucketRegion = 'ap-northeast-2';

	AWS.config.update({
  region: bucketRegion,
  credentials: {
   accessKeyId: 'AKIAZYJCQLWOEQTFH3XD', 
   secretAccessKey: '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'
  }
});

 s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName, signatureVersion: 'v4' }
});

	var params = {Bucket: albumBucketName , Key: path, Expires: 60};
	var url = s3.getSignedUrl('getObject', params);
	console.log('The URL is', url);
	return url;
}