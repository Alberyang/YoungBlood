package com.youngblood.controller;


import com.youngblood.dao.UserDao;
import com.youngblood.entity.User;
import com.youngblood.entity.response.ResponseContent;
import com.youngblood.enums.EnumYoungBloodException;
import com.youngblood.exceptions.YoungBloodException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("")
public class UserWebController {
    @Autowired
    private UserDao userDao;
    @GetMapping("/test")
    public void test(){
        System.out.println("hello");
    }
    //测试获取全部用户
    @GetMapping("users")
    public ResponseEntity<ResponseContent> queryAllUsers(){
        List<User> users = userDao.findAll();
//        if(users==null){
//            throw new YoungBloodException(EnumYoungBloodException.);
//        }
        return ResponseEntity.status(200).body(new ResponseContent(200,users,"get all of users"));
    }


}
