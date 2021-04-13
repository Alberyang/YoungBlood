package com.youngblood.dao.impl;

import com.mongodb.client.result.DeleteResult;
import com.youngblood.dao.InfoReviewDao;
import com.youngblood.entity.Info;
import com.youngblood.entity.InfoReview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class InfoReviewDaoImpl implements InfoReviewDao {
    @Autowired
    MongoTemplate mongoTemplate;
    @Override
    public InfoReview findById(String id) {
        return mongoTemplate.findById(id,InfoReview.class);
    }

    @Override
    public List<InfoReview> findByInfoIdPageable(String infoId,Integer page,Integer limit) {
        Query query = new Query();
        query.addCriteria(Criteria.where("infoId").is(infoId));
        //分页
        Pageable pageable = PageRequest.of(page,limit);
        query.with(pageable);
        query.with(Sort.by(Sort.Direction.DESC, "createDate"));
        List<InfoReview> infoReviews = mongoTemplate.find(query, InfoReview.class);
//        Query query_count = new Query();
//        query_count.addCriteria(Criteria.where("infoId").is(infoId));
//        long reviewNum = mongoTemplate.count(query_count, "review");
//        OCPageResult pageResult = new OCPageResult();
//        pageResult.setItems(infoReviews);
//        pageResult.setTotal(reviewNum);
//        pageResult.setTotalPage(reviewNum/limit);
        return infoReviews;
    }

    @Override
    public List<InfoReview> findByInfoId(String infoId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("infoId").is(infoId));
        query.with(Sort.by(Sort.Direction.DESC, "createDate"));
        List<InfoReview> infoReviews = mongoTemplate.find(query, InfoReview.class);
        return infoReviews;
    }

    @Override
    public boolean saveInfoReview(InfoReview infoReview) {
        infoReview.setCreateDate(new Date().getTime()/1000);
        infoReview.setUpdateDate(new Date().getTime()/1000);
        InfoReview review = mongoTemplate.save(infoReview, "review");
        if(review.getId()==null){
            return false;
        }
        return true;
    }

    @Override
    public int getReviewsNumByInfoId(String infoId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("infoId").is(infoId));
        long count = mongoTemplate.count(query, InfoReview.class);
        return (int)count;

    }

    @Override
    public Boolean deleteById(String reviewId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(reviewId));
        DeleteResult remove = mongoTemplate.remove(query, InfoReview.class);
        return remove.wasAcknowledged();
    }

    @Override
    public Boolean deleteByInfoId(String infoId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("infoId").is(infoId));
        DeleteResult remove = mongoTemplate.remove(query, InfoReview.class);
        return remove.wasAcknowledged();
    }

}
