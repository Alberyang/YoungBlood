package com.youngblood.dao.impl;

import com.youngblood.dao.UserDao;
import com.youngblood.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {
    @Autowired
    private MongoTemplate mongoTemplate;

    // just use this function for test
    @Override
    public List<User> findAll() {
        return mongoTemplate.findAll(User.class);
    }

    @Override
    public User findByUserId(String userId) {
        return mongoTemplate.findById(userId,User.class);
    }
}
