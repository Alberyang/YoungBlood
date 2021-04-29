package com.youngblood.exceptions;

import com.youngblood.enums.EnumYoungBloodException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class YoungBloodException extends RuntimeException {
    private EnumYoungBloodException enumYoungBloodException;
}
