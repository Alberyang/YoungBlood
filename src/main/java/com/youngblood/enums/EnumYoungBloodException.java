package com.youngblood.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum  EnumYoungBloodException {
    MSG_ADDED_ERROR(500,"Error from adding a new message"),
    MSG_LIKE_ERROR(500,"Error from liking "),
    MSG_COLLECT_ERROR(500,"Error from collecting"),
    NEW_INFO_CANNOT_BE_FOUND(400,"Info can't be found"),
    MSG_UNLIKE_ERROR(500,"Error after unliking info"),
    MSG_LIKE_HISTORY_ERROR(500,"Error from getting the like history"),
    MSG_UNCOLLECT_ERROR(500,"Error from uncollecting info"),
    MSG_COLLECT_HISTORY_ERROR(500,"Error from getting the collect history"),
    MSG_DELETED_ERROR(500,"Error from deleting the info"),
    MSG_UPDATED_ERROR(500,"Error from updating the info"),
    REVIEW_CANNOT_BE_FOUND(400,"Review cannot be found"),
    REVIEW_ADDED_ERROR(500,"Review added error"),
    REVIEW_DELETED_ERROR(500,"Review deleted error"),
    REVIEW_CONTENT_NULL(400,"Review content is null, please assign a value to the field of content"),
    PICTURES_UPLOAD_ERROR(500,"File can't be uploaded"),
    PICTURES_DELETED_ERROR(500,"Delete pictures error")

    ;

    private int code;
    private String msg;
}
