#!/bin/bash

# B2 bucket 名称
BUCKET_NAME="artab-files"

# 定义 CORS 规则 JSON
CORS_RULES='[
    {
        "corsRuleName": "downloadFromAnyOriginWithUpload", 
        "allowedOrigins": [
           "*"                    
        ],
        "allowedHeaders": [
            "authorization",
            "content-type",
            "x-bz-file-name",
            "x-bz-content-sha1"
        ],
        "allowedOperations": [
            "b2_download_file_by_id",
            "b2_download_file_by_name",
            "b2_upload_file",
            "b2_upload_part"
        ],
        "maxAgeSeconds": 3600
    }
]'

# 生成压缩后的 JSON
COMPRESSED_JSON=$(echo "$CORS_RULES" | jq -c .)

# 打印将要执行的命令
echo "即将执行的命令："

# 更新 bucket 的 CORS 规则
b2 update-bucket --cors-rules "$COMPRESSED_JSON" $BUCKET_NAME allPublic

echo "CORS rules have been updated for bucket: $BUCKET_NAME"
