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
    MSG_COLLECT_ERROR(500,"Error from collecting")
    ;
    private int code;
    private String msg;
}
