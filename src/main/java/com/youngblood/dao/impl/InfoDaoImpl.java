package com.youngblood.dao.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import com.youngblood.dao.InfoDao;
import com.youngblood.dao.InfoReviewDao;
import com.youngblood.dao.UserDao;
import com.youngblood.entity.*;
import com.youngblood.enums.EnumYoungBloodException;
import com.youngblood.exceptions.YoungBloodException;
import com.youngblood.service.impl.PictureServiceImpl;
import com.youngblood.utils.RedisUtil;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class InfoDaoImpl implements InfoDao {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private UserDao userDao;
    @Autowired
    private InfoReviewDao infoReviewDao;
    @Autowired
    private PictureServiceImpl pictureService;

    @Autowired
    private RedisUtil redisUtil;

    // just use this function for test
    @Override
    public Long findAllNums() {
        Query query = new Query();
        long nums = mongoTemplate.count(query, "info");
        //遍历所有数据 --- 数据量过大造成堆内存溢出
//        FindIterable<Document> infoList = mongoTemplate.getCollection("info").find();
//        List<Info> result = new ArrayList<>();
//        double i = 1.000;
//        while(infoList.cursor().hasNext()){
//            Document next = infoList.cursor().next();
//            System.out.println("查表进度: "+ i/3000 + "%");
//            i++;
//            String info_json = next.toJson();
//            result.add(JSON.parseObject(info_json,Info.class));
//        }
//        return result;
        return nums;
    }

    @Override
    public List<Info> findPageable(Integer page, Integer limit) {
        Query query = new Query();
        Pageable pageable = PageRequest.of(page,limit);
        query.with(pageable);
        List<Info> infos = mongoTemplate.find(query, Info.class);
        return infos;
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
        info.setUser(user.getId());
        info.setUsername(user.getUsername());
        info.setCreateDate(startDate);
        info.setUpdateDate(startDate);
        info.setViews(0);
        info.setReviews(0);
        info.setThumbs(0);
        Info newInfo = mongoTemplate.save(info, "info");
        return newInfo.getId();
    }

    @Override
    public boolean deleteById(String id) {
        // 需要删除该贴对应的redis中点赞 浏览数 mongo中info review 热度 镜像 对象存储图片信息
        Info info = this.findById(id);
        if(info.isHasImage()){
            List<String> images = info.getImages();
            try {
                pictureService.deleteObjects(images);
            } catch (IOException e) {
                e.printStackTrace();
                throw new YoungBloodException(EnumYoungBloodException.PICTURES_DELETED_ERROR);
            }
        }
        // delete info
        Query delInfo = new Query();
        delInfo.addCriteria(Criteria.where("id").is(id));
        DeleteResult removeA = mongoTemplate.remove(delInfo, Info.class);
        // delete heat
        Query delHeat = new Query();
        delHeat.addCriteria(Criteria.where("infoId").is(id));
        DeleteResult removeB = mongoTemplate.remove(delInfo, InfoHeat.class);
        // delete snapshot
        Query delSnapShot = new Query();
        delSnapShot.addCriteria(Criteria.where("oriInfoId").is(id));
        DeleteResult removeC = mongoTemplate.remove(delInfo, InfoSnapshot.class);
        // delete infoReview
        Boolean removeD = infoReviewDao.deleteByInfoId(id);
        redisUtil.delete("micro:like:"+id);
        redisUtil.delete("micro:view:"+id);
//        redisUtil.zRemove("micro_allHeatInfo",new Object[]{id});
        return removeA.wasAcknowledged()&&removeB.wasAcknowledged()&&removeC.wasAcknowledged()&&removeD;
    }

    @Override
    public boolean updateInfo(Info info) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(info.getId()));
        Update update = new Update();
        update.set("contents",info.getContents());
        update.set("hasImage",info.isHasImage());
        update.set("images",info.getImages());
        update.set("updateDate",new Date().getTime()/1000);
        UpdateResult updateResult = mongoTemplate.updateFirst(query, update, Info.class);
        return updateResult.wasAcknowledged();
    }

    @Override
    public void updateInfoReviewNum(String infoId, int num) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(infoId));
        Update update = new Update();
        update.inc("reviews",num);
        mongoTemplate.updateFirst(query,update,Info.class);
    }

}
