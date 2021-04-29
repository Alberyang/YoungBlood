package com.youngblood.advice;

import com.youngblood.YoungBloodApplication;
import com.youngblood.entity.response.ResponseContent;
import com.youngblood.enums.EnumYoungBloodException;
import com.youngblood.exceptions.YoungBloodException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CommonExceptionHandler {
    @ExceptionHandler(YoungBloodException.class)
    public ResponseEntity<ResponseContent> handleException(YoungBloodException e){
        EnumYoungBloodException em = e.getEnumYoungBloodException();
        ResponseContent rc = new ResponseContent();
        rc.setCode(em.getCode());
        rc.setData("");
        rc.setMsg(em.getMsg());
        return ResponseEntity.status(em.getCode()).body(rc);
    }

}
