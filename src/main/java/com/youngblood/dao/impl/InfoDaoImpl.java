package com.youngblood.dao.impl;

import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import com.youngblood.dao.InfoDao;
import com.youngblood.dao.UserDao;
import com.youngblood.entity.Info;
import com.youngblood.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class InfoDaoImpl implements InfoDao {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private UserDao userDao;

    // just use this function for test
    @Override
    public List<Info> findAll() {
        return mongoTemplate.findAll(Info.class);
    }

    @Override
    public Info findById(String id) {
        return mongoTemplate.findById(id,Info.class);
    }

    @Override
    public List<Info> findByIds(String... ids) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").in(ids));
        return mongoTemplate.find(query,Info.class,"info");
    }

    @Override
    public List<Info> findByIdsDateOrder(String... ids) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").in(ids)).with(Sort.by(Sort.Order.desc("createDate")));
        return mongoTemplate.find(query,Info.class,"info");
    }

    @Override
    public String saveInfo(Info info, String userId) {
        User user = userDao.findByUserId(userId);
        Long startDate = new Date().getTime()/1000;
        info.setUser(user);
        info.setCreateDate(startDate);
        info.setUpdateDate(startDate);
        Info newInfo = mongoTemplate.save(info, "info");
        return newInfo.getId();
    }

    @Override
    public boolean deleteById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        DeleteResult remove = mongoTemplate.remove(query, Info.class);
        return remove.wasAcknowledged();
    }

    @Override
    public boolean updateInfo(Info info) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(info.getId()));
        Update update = new Update();
        update.set("title",info.getTitle());
        update.set("text",info.getText());
        update.set("hasImage",info.isHasImage());
        update.set("urls",info.getUrls());
        update.set("updateDate",new Date().getTime()/1000);
        UpdateResult updateResult = mongoTemplate.updateFirst(query, update, Info.class);
        return updateResult.wasAcknowledged();
    }

    @Override
    public void addInfoView(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        Update update = new Update();
        update.inc("views",1);
        mongoTemplate.updateFirst(query, update, Info.class);
    }
}
