package com.a205.beatween.common.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.net.URL;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Util {

    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * 공통 S3 업로드 유틸
     * @param imageBytes 업로드할 파일 바이너리
     * @param contentType 파일 타입 (예: image/png, application/xml)
     * @param prefix 경로 prefix (예: "display/1/2/3" 또는 "sheets/drum")
     * @param extension 확장자 (예: "png", "xml")
     * @return S3에 업로드된 파일의 전체 URL
     */
    public String upload(byte[] imageBytes, String contentType, String prefix, String extension) {
        String key = String.format("%s/%s.%s", prefix, UUID.randomUUID(), extension);

        try {
            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(req, RequestBody.fromBytes(imageBytes));

            S3Utilities s3Utilities = s3Client.utilities();
            URL url = s3Utilities.getUrl(builder -> builder.bucket(bucket).key(key));
            return url.toString();
        } catch (S3Exception e) {
            log.error("S3 upload failed for key={} message={}", key, e.getMessage());
            throw new IllegalStateException("Failed to upload file to S3", e);
        }
    }
}
