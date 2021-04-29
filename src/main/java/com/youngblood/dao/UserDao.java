package com.youngblood.dao;

import com.youngblood.entity.User;

import java.util.List;

public interface UserDao {
    // 查询
    List<User> findAll();

    User findByUserId(String userId);
}
