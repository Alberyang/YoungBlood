package com.youngblood.service.impl;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.exception.CosClientException;
import com.qcloud.cos.exception.CosServiceException;
import com.qcloud.cos.model.*;
import com.qcloud.cos.region.Region;
import com.qcloud.cos.transfer.MultipleFileUploadImpl;
import com.youngblood.enums.EnumYoungBloodException;
import com.youngblood.exceptions.YoungBloodException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class PictureServiceImpl {
    String bucketName = "youngblood-1301342856";
    String regionName = "ap-nanjing";
    String appId = "";

    // 1 初始化用户身份信息（secretId, secretKey）。
    String secretId = "AKIDrDJFwhdVWKRJ0ScJKHQhndjbIirphicK";
    String secretKey = "h9NR3PUHzavzmZ7PQEvLVOGrAC0lGTUX";
    COSCredentials cred = new BasicCOSCredentials(secretId, secretKey);
    // 2 设置 bucket 的区域, COS 地域的简称请参照 https://cloud.tencent.com/document/product/436/6224
    // clientConfig 中包含了设置 region, https(默认 http), 超时, 代理等 set 方法, 使用可参见源码或者常见问题 Java SDK 部分。

    Region region = new Region(regionName);
    ClientConfig clientConfig = new ClientConfig(region);


    public COSCredentials getCred(){
        return new BasicCOSCredentials(secretId, secretKey);
    }

    //创建存储桶
    public void createStoreBucket(){
        // 3 生成 cos 客户端。
        COSClient cosClient = new COSClient(cred, clientConfig);
        String bucket = "examplebucket-1250000000"; //存储桶名称，格式：BucketName-APPID
        CreateBucketRequest createBucketRequest = new CreateBucketRequest(bucket);
        // 设置 bucket 的权限为 Private(私有读写), 其他可选有公有读私有写, 公有读写
        createBucketRequest.setCannedAcl(CannedAccessControlList.Private);
        try{
            Bucket bucketResult = cosClient.createBucket(createBucketRequest);
        } catch (CosServiceException serverException) {
            serverException.printStackTrace();
        } catch (CosClientException clientException) {
            clientException.printStackTrace();
        }
    }

    //查询存储桶列表
    public List<Bucket> queryBucketList(){
        // 3 生成 cos 客户端。
        COSClient cosClient = new COSClient(cred, clientConfig);
        List<Bucket> buckets = cosClient.listBuckets();
        for (Bucket bucketElement : buckets) {
            String bucketName = bucketElement.getName();
            String bucketLocation = bucketElement.getLocation();
        }
        return buckets;
    }

    // 上传到存储桶
    public void saveObjectFile(String path,String fileName){
        // 3 生成 cos 客户端。
        COSClient cosClient = new COSClient(cred, clientConfig);
        // 指定要上传的文件
        File localFile = new File(path);
        // 指定要上传到的存储桶
//        String bucketName = "examplebucket-1250000000";
        // 指定要上传到 COS 上对象键
//        String key = keyValue;
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, localFile);
        PutObjectResult putObjectResult = cosClient.putObject(putObjectRequest);
        cosClient.shutdown();
    }

    // 上传到存储桶
    public List<String> saveObjectsStream(MultipartFile[] multipartFile){
        // 3 生成 cos 客户端。
        COSClient cosClient = new COSClient(cred, clientConfig);
        List<String> urls = new ArrayList<>();
        ObjectMetadata metadata = new ObjectMetadata();
        for(MultipartFile file:multipartFile){
            String key = file.getOriginalFilename();
            try {
                PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, key, file.getInputStream(),metadata);
                cosClient.putObject(putObjectRequest);
//                Date expiration = new Date(new Date().getTime() + 5 * 60 * 10000);
//                URL url = cosClient.generatePresignedUrl(bucketName, key, expiration);
                String url = "https://youngblood-1301342856.cos.ap-nanjing.myqcloud.com/"+key;
                urls.add(url);
            } catch (IOException e) {
                e.printStackTrace();
                throw new YoungBloodException(EnumYoungBloodException.PICTURES_UPLOAD_ERROR);
            }
        }
        cosClient.shutdown();
        return urls;
    }
    // 查询下载存储对象
    public void getObject() throws IOException {
        // 3 生成 cos 客户端。
        COSClient cosClient = new COSClient(cred, clientConfig);
        // Bucket的命名格式为 BucketName-APPID ，此处填写的存储桶名称必须为此格式
        String bucketName = "examplebucket-1250000000";
        String key = "exampleobject";
        // 方法1 获取下载输入流
        GetObjectRequest getObjectRequest = new GetObjectRequest(bucketName, key);
        COSObject cosObject = cosClient.getObject(getObjectRequest);
        COSObjectInputStream cosObjectInput = cosObject.getObjectContent();
        // 下载对象的 CRC64
        String crc64Ecma = cosObject.getObjectMetadata().getCrc64Ecma();
        // 关闭输入流
        cosObjectInput.close();
        // 方法2 下载文件到本地
//        String outputFilePath = "exampleobject";
//        File downFile = new File(outputFilePath);
//        getObjectRequest = new GetObjectRequest(bucketName, key);
//        ObjectMetadata downObjectMeta = cosClient.getObject(getObjectRequest, downFile);
    }
    // 删除存储对象
    public void deleteObject(String fileName) throws IOException{
        COSClient cosClient = new COSClient(cred, clientConfig);
        // Bucket的命名格式为 BucketName-APPID ，此处填写的存储桶名称必须为此格式
//        String bucketName = "examplebucket-1250000000";
//        String key = "exampleobject";
        cosClient.deleteObject(bucketName, fileName);
    }
    // 删除多个存储对象
    public void deleteObjects(List<String> keys) throws IOException{
        COSClient cosClient = new COSClient(cred, clientConfig);
        for(String key:keys){
            cosClient.deleteObject(bucketName, key);
        }

    }
}
