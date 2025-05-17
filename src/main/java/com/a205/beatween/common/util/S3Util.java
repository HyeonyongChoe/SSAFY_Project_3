package com.a205.beatween.common.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.net.URL;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Util {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * S3에 파일 업로드
     * @param fileBytes 업로드할 파일의 byte[]
     * @param contentType MIME 타입 (예: image/png, application/xml)
     * @param key 업로드 경로 및 파일명 (예: profiles/123.png)
     * @return S3 URL 문자열
     */
    public String upload(byte[] fileBytes, String contentType, String key) {
        try {
            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(req, RequestBody.fromBytes(fileBytes));

            URL url = s3Client.utilities()
                    .getUrl(b -> b.bucket(bucket).key(key));
            return url.toString();
        } catch (S3Exception e) {
            log.error("S3 upload failed for key={} : {}", key, e.getMessage());
            throw new IllegalStateException("S3 업로드 실패", e);
        }
    }

    /**
     * S3에서 파일 삭제
     * @param key 삭제할 파일의 key
     */
    public void delete(String key) {
        try {
            DeleteObjectRequest req = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();

            s3Client.deleteObject(req);
        } catch (S3Exception e) {
            log.error("S3 delete failed for key={} : {}", key, e.getMessage());
            throw new IllegalStateException("S3 삭제 실패", e);
        }
    }

    /**
     * S3 URL 반환
     * @param key 파일 key
     * @return 전체 URL 문자열
     */
    public String getUrl(String key) {
        try {
            URL url = s3Client.utilities()
                    .getUrl(b -> b.bucket(bucket).key(key));
            return url.toString();
        } catch (S3Exception e) {
            log.error("S3 URL 조회 실패 key={} : {}", key, e.getMessage());
            throw new IllegalStateException("S3 URL 조회 실패", e);
        }
    }
}
